/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
 * Copyright (C) 2017-2017 刘文成 (wencheng.lwc@antfin.com)
*/

import {compose, isRegExp} from './utils';
import {autorun} from 'mobx';

const emptyFn = () => {};

function spliter(target, keys, fn) {
    if (keys.length === 0) {
        return fn(target);
    }

    return target.split(keys[0]).map(item => spliter(item, keys.slice(1), fn)).filter(item => item);
}

function isActionKey(key) {
    return key && key.split('.').length === 2;
}

function checkFilters(filters) {
    if (typeof filters === 'object') {
        Object.keys(filters).forEach((key) => {
            const filter = filters[key];
            if (typeof filter !== 'function') {
                throw new TypeError(`[MobxRelation] filters "${key}" must be a function`);
            }
        });
    } else {
        throw new TypeError('[MobxRelation] filters must be an Object.');
    }
}
/**
 * regexp support
 */
export default class MobxRelation {
    constructor(opts = {}) {
        this._relations = [];
        this._filters = {};
        this._inits = [];
        this._autoruns = [];
        this.addFilters(opts.filters);
    }

    addFilters(filters = {}) {
        checkFilters(filters);
        this._filters = {
            ...this._filters,
            ...filters
        };
    }

    init(initFn) {
        if (typeof initFn === 'function') {
            this._inits.push(initFn);
        } else {
            throw new Error(`[MobxRelation] Relation init need a function but get ${typeof initFn}.`);
        }
    }

    use(...args) {
        args.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(this);
            } else {
                throw new Error(`[MobxRelation] relation.use need functions but get ${typeof fn}.`);
            }
        });
    }

    autorun(autorun) {
        if (typeof autorun === 'function') {
            this._autoruns.push(autorun);
        } else {
            throw new Error('[MobxRelation] Relation autorun need a function.');
        }
    }

    triggerAutorun(context) {
        this._autoruns.forEach(fn => {
            autorun(fn.bind(null, context.data));
        });
    }

    triggerInit(context) {
        this._inits.forEach(fn => fn(context.data));
    }

    listen(patterns, fn, errorFn) {
        if (typeof patterns === 'string') {
            patterns = patterns.split(/\r?\n/)
            // filter "#..." comments
                .filter(item => item && !/^\s*#.*$/.test(item)).join('').replace(/\s*/g, '').split(';').filter(item => item);
            if (patterns.length === 0) {
                throw new Error('[MobxRelation] Relation pattern can not be empty.');
            }
            patterns.forEach(pattern => this._addRelation(pattern, fn, errorFn));
        } else if (isRegExp(patterns)) {
            this._addRelation(patterns, fn, errorFn);
        } else {
            throw new Error('[MobxRelation] Listen pattern must be a String or RegExp.');
        }
        return this;
    }

    execInMiddleware({fullname, payload, context}) {
        context = {
            ...context.data
        };
        this._relations.forEach(({pattern, fn, errorFn}) => {
            let chain = [];

            if ((!isRegExp(pattern.action) && fullname !== pattern.action) || (isRegExp(pattern.action) && !pattern.action.test(fullname))) {
                return;
            }

            try {
                pattern.chain.forEach((item, index) => {
                    chain = chain.concat(item);
                    if (pattern.chain.length - 1 !== index) {
                        chain.push(emptyFn);
                    }
                });

                chain = chain.map((key) => {
                    if (typeof key === 'string') {
                        if (isActionKey(key)) {
                            const [name, action] = key.split('.');
                            const model = context[name];
                            if (model && model[action]) {
                                return model[action].bind(model);
                            }
                            throw new Error(`[MobxRelation] Action "${key}" is not defined.`);
                        }
                        return this._filters[key];
                    }
                    return key;
                });

                compose(chain, payload).then(res => fn({context, payload: res, action: fullname})).catch(e => errorFn({context, payload: e, action: fullname}));
            } catch (e) {
                errorFn({context, payload: e, action: fullname});
            }
        });
    }

    parsePattern(pattern) {
        if (isRegExp(pattern)) {
            return {action: pattern, refs: [], chain: []};
        }
        pattern = pattern.replace(/\s*/g, '');
        if (!pattern) {
            throw new Error(`[MobxRelation] Relation pattern can not be empty.`);
        }
        if (!/^[\#\-\>\=\.a-zA-Z_0-9\|]+$/.test(pattern)) {
            throw new Error(`[MobxRelation] Relation pattern "${pattern}" illegal.`);
        }
        const refs = [];
        const chain = spliter(pattern, [
            '->', /\=\>|\|/
        ], (key) => {
            if (isActionKey(key)) {
                const modelName = key.split('.')[0];
                if (!refs.includes(modelName))
                    refs.push(modelName);
                }
            else if (key && !this._filters[key]) {
                throw new Error(`[MobxRelation] Undefined filter "${key}"`);
            }
            return key;
        }).filter(item => item.length !== 0);
        const action = chain[0][0];
        if (!action || !isActionKey(action)) {
            throw new Error('[MobxRelation] Relation pattern need an dispatcher action.');
        }
        chain[0] = chain[0].slice(1);
        return {action, refs, chain};
    }

    _addRelation(pattern, fn, errorFn) {
        pattern = this.parsePattern(pattern);
        this._relations.push({
            pattern,
            fn: fn || emptyFn,
            errorFn: errorFn || function({payload}) {
                throw payload;
            }
        });
    }
}
