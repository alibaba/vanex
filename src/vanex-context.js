/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
 * Copyright (C) 2017-2017 刘文成 (wencheng.lwc@antfin.com)
*/

/**
 * MobxContent:在执行start初始化应用的时候，会:
 * 1、将传递进来的配置项（Model/Middleware/Relation保存处理）；
 * 2、实例化传递进来的Model数据，并将middleware作为参数传进去；
 * 3、执行Relation的相关操作，初始化及Middleware添加hook。
 * */

import MobxModel, {isMobxModelClass} from './vanex-model';
import {each, isObject, mapValues} from './utils';

import MobxRelation from './vanex-relation';
import createModel from './create-model';
import globalMiddleware from './vanex-middleware';

export default class MobxContext {
    /**
     * @param {Object} models
     * @param {Object} opts
     *    - parentContext
     *    - middleware
     *    - relation
     */
    constructor(models = {}, opts = {}) {
        this._middleware = opts.middleware || globalMiddleware;
        this._relation = opts.relation || new MobxRelation;
        this._plugin = opts.plugin;

        this._models = {};

        this.models = models;

        this.setData(models);

        this._addRelationMiddleware();

        // trigger relation init function in async
        setTimeout(() => {
            this._relation.triggerInit(this);
            this._relation.triggerAutorun(this);
        });
    }

    set models(models) {
        // 校验是否重名
        Object.keys(models).some(key => {
            if(key in this._models) {
                console.error(`[vanex]: You have already existed the same model key: '${key}'`);

                return true;
            }
        });

        this._models = Object.assign((this._models || {}), models);
    }

    setData(models) {
        this._data = Object.assign({}, this._data, mapValues(models, Model => {
            if(isObject(Model)) {
                Model = createModel(Model);
            }

            // Get a class
            if (isMobxModelClass(Model)) {
                const result = new Model(null, this._middleware, this._plugin);
                return result;
            }

            // Get an instance
            if (Model instanceof MobxModel) {
                // update model's middleware
                Model.middleware = this._middleware;
                Model._plugin = this._plugin;
                return Model;
            }
        }));
    }

    addModel(models) {
        this.models = models;

        this.setData(models);
    }

    _addRelationMiddleware() {
        if (this._relationRemove) {
            return;
        }

        const hook = arg => {
            const fullname = `${this._findKeyByModel(arg.model)}.${arg.action}`;

            // exec async
            setTimeout(() => {
                this._relation.execInMiddleware({
                    ...arg,
                    fullname,
                    context: this,
                });
            });

            return arg.payload;
        };

        // 在这里设置了relation进去，使得在中间件执行结束后会自动执行这里的hook
        this._relationRemove = this._middleware.use({
            after: hook
        });
    }

    set relation(newRelation) {
        this._relation = newRelation;
    }

    get relation() {
        return this._relation;
    }

    get middleware() {
        return this._middleware;
    }

    get data() {
        return this._data;
    }

    destroy() {
        // remove relation middleware
        if (this._relationRemove) {
            this._relationRemove();
            this._relationRemove = null;
        }
    }

    checkMobxModels(mobxModels) {
        if (Array.isArray(mobxModels)) {
            mobxModels.forEach((name) => {
                if (!this._data[name]) {
                    throw new Error(`[@observer] Can not find data "${name}" in MobxContext.`);
                }
            });
        } else {
            each(mobxModels, (MobxModel, name) => {
                if (this._data[name]) {
                    if (!isMobxModelClass(MobxModel)) {
                        throw new TypeError(`[@observer] MobxContext required MobxModel class.`);
                    }
                    if (!(this._data[name]instanceof MobxModel)) {
                        throw new TypeError(`[@observer] ${name} is not instance of ${MobxModel.name}.`);
                    }
                } else {
                    throw new Error(`[@observer] Can not find data "${name}" in MobxContext.`);
                }
            });
        }
    }

    pick(...keys) {
        return keys.reduce((obj, key) => {
            if (!this._data[key])
                throw new Error(`[MobxContext] Can not find data "${key}" in MobxContext.`);
            obj[key] = this._data[key];
            return obj;
        }, {});
    }

    find(key) {
        if (!this._data[key])
            throw new Error(`[MobxContext] Can not find data "${key}" in MobxContext.`);
        return this._data[key];
    }

    _findKeyByModel(model) {
        return Object.keys(this._data).find(key => this._data[key] === model);
    }
}
