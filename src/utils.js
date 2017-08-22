/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
*/

const toString = Object.prototype.toString;

import invariant from 'invariant';
import {
    observable,
} from 'mobx';
import { set } from 'jsonuri';

/**
 * Applies a function to every key-value pair inside an object.
 *
 * @param {Object} obj - The source object.
 * @param {Function} fn - The mapper function that receives the value and the key.
 * @param {Object?} res - Result object
 * @returns {Object} A new object that contains the mapped values for the keys.
 */
export function mapValues(obj, fn, res = {}) {
    return Object.keys(obj).reduce((result, key) => {
        const curRes = fn(obj[key], key);
        result[key] = curRes;

        return result;
    }, res);
}

export function deepMapValues(obj, fn, res = {}) {
    return Object.keys(obj).reduce((result, key) => {
        let val = obj[key];

        let keys = key.split('.');
        let len = keys.length;

        let lastKey = keys[len - 1];

        set(result, keys.join('/'), fn(val, lastKey));

        return result;
    }, res);
}

/**
 * @param {*} val
 * @returns {Promise}
 */
export function toPromise(val) {
    if (val && typeof val.then === 'function') {
        return val;
    }
    return Promise.resolve(val);
}

export function toObservableObj(obj = {}) {
    return mapValues(obj, (item) => {
        return observable(item);
    });
}

export function each(obj = {}, fn) {
    Object.keys(obj).forEach((key) => {
        fn(obj[key], key);
    });
}
export const isFunction = arg => toString.call(arg) === '[object Function]';
export const isRegExp = arg => toString.call(arg) === '[object RegExp]';
export const isObject = arg => toString.call(arg) === '[object Object]';

export function compose(arr, arg) {
    return arr.reduce((cur, fn) => {
        return cur.then(res => fn(res));
    }, Promise.resolve(arg));
}

export function nameToUpperCase(name = '') {
    return name[0].toUpperCase() + name.slice(1);
}

export function inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    if (superClass) {
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(subClass, superClass);
        } else {
            subClass.__proto__ = superClass;
        }
    }
}

export function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

export function possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}
