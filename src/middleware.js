/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
*/

import {
    isFunction
} from './utils';

export default class Middleware {
    middleware = [];

    constructor(middleware) {
        this.use(middleware);
    }

    /**
     * Add middleware
     * @param  {Function|Array<Function>} middleware
     */
    use(middleware = []) {
        if (!Array.isArray(middleware)) {
            middleware = [middleware];
        }

        for (const fn of middleware) {
            if (!isFunction(fn)) {
                throw new TypeError('Middleware must be composed of functions!');
            }
        }
        
        this.middleware = [...this.middleware, ...middleware];
    }

    remove(middleware = []) {
        if (!Array.isArray(middleware)) {
            middleware = [middleware];
        }

        middleware.forEach((item) => {
            const index = this.middleware.indexOf(item);
            this.middleware.splice(index, 1);
        });
    }

    isEmpty() {
        return this.middleware.length === 0;
    }

    /**
     * Compose all middleware
     * @param {object} arg
     * @return {Promise}
     */
    compose(arg = {}) {
        return this.middleware.reduce((pm, fn) => {
            return pm.then((payload) => {
                return fn({...arg,
                    payload
                });
            });
        }, Promise.resolve(arg.payload));
    }
}
