/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
 * Copyright (C) 2017-2017 刘文成 (wencheng.lwc@antfin.com)
*/

import {
    isRegExp,
    mapValues
} from './utils';

import Middleware from './middleware';

const KEYS = ['before', 'after', 'error', 'filter'];

function toFilter(filter) {
    if (isRegExp(filter)) {
        return ({
            type
        }) => filter.test(type);
    } else if (typeof filter === 'string') {
        return ({
            type
        }) => filter === type;
    } else if (typeof filter === 'function') {
        return filter;
    }
    throw new TypeError('[ComposeMiddleware] Middleware filter must be RegExp, String or Function.');
}

export class ComposeMiddleware {
    static toStandardMiddleware(_middleware = {}) {
        if (typeof _middleware === 'function') {
            return {
                after: _middleware,
            };
        } else if (typeof _middleware === 'object') {
            const middleware = {};
            Object.keys(_middleware).forEach(key => {
                if (!KEYS.includes(key)) {
                    throw new Error(`[ComposeMiddleware] Middleware key must one of "${KEYS.join(' ,')}"`);
                }
                // filter empty middleware
                if (_middleware[key]) {
                    middleware[key] = _middleware[key];
                }
            });

            if (middleware.filter) {
                const filter = toFilter(middleware.filter);
                delete middleware.filter;
                // to filter function
                return mapValues(middleware, (res) => {
                    res = Array.isArray(res) ? res : [res];
                    return res.map((fn) => {
                        return function middlewareFilterMixin({
                            payload
                        }) {
                            if (!filter(...arguments)) {
                                 return payload;
                            }
                                
                            return fn(...arguments);
                        };
                    });
                }, {});
            }
            return middleware;
        }
        throw new TypeError('[ComposeMiddleware] Middleware must be a function or object but get ' + _middleware);
    }

    constructor() {
        this._before = new Middleware;
        this._after = new Middleware;
        this._error = new Middleware;
    }

    use(...args) {
        const removes = [];
        args.forEach(middleware => {
            middleware = ComposeMiddleware.toStandardMiddleware(middleware);
            Object.keys(middleware).forEach(pos => {
                const cur = this['_' + pos];// before | after | error
                cur.use(middleware[pos]);
                removes.push(() => cur.remove(middleware[pos]));
            });
        });

        return function removeMiddlewares() {
            removes.map(rm => rm());
        };
    }

    execAction({
        actionFn,
        actionArgs = [],
        actionName,
        actionContext
    }) {
        const args = {
            action: `${actionContext}/${actionName}`,
            model: actionContext,
            type: `${actionContext}.${actionName}`
        };

        return this
            ._before
            .compose({
                ...args,
                payload: actionArgs,
                pos: 'before'
            })
            .then(args => {
                if (!Array.isArray(args)) {
                    throw new Error('[ComposeMiddleware] Pre middleware must return arguments');
                }

                return actionFn.apply(actionContext, args);
            })
            .then(payload => {
                return this._after.compose({
                    ...args,
                    payload,
                    pos: 'after'
                });
            })
            .catch(error => {
                return this._error.compose({
                    ...args,
                    payload: error,
                    pos: 'error'
                }).then(error => {
                    if (error instanceof Error) {
                        throw error;
                    }
                    return error;
                });
            });
    }
}

export default new ComposeMiddleware;
