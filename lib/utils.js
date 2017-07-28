'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isObject = exports.isRegExp = exports.isFunction = undefined;

var _setPrototypeOf = require('babel-runtime/core-js/object/set-prototype-of');

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.mapValues = mapValues;
exports.deepMapValues = deepMapValues;
exports.toPromise = toPromise;
exports.toObservableObj = toObservableObj;
exports.each = each;
exports.compose = compose;
exports.nameToUpperCase = nameToUpperCase;
exports.inherits = inherits;
exports.classCallCheck = classCallCheck;
exports.possibleConstructorReturn = possibleConstructorReturn;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _mobx = require('mobx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toString = Object.prototype.toString;

/**
 * Applies a function to every key-value pair inside an object.
 *
 * @param {Object} obj - The source object.
 * @param {Function} fn - The mapper function that receives the value and the key.
 * @param {Object?} res - Result object
 * @returns {Object} A new object that contains the mapped values for the keys.
 */
function mapValues(obj, fn) {
    var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return (0, _keys2.default)(obj).reduce(function (result, key) {
        var curRes = fn(obj[key], key);
        result[key] = curRes;

        return result;
    }, res);
}

function deepMapValues(obj, fn) {
    var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    return (0, _keys2.default)(obj).reduce(function (result, key) {
        var val = obj[key];

        var keys = key.split('.');

        if (keys.length > 1) {
            var len = keys.length;
            var lastKey = keys[len - 1];
            var lastRes = void 0;

            for (var i = 0; i < len - 1; i++) {
                var curKey = keys[i];

                if (lastRes && curKey in lastRes) {
                    lastRes = lastRes[curKey]; // 让lastRes取到最后一个值
                } else if (curKey in result) {
                    lastRes = result[curKey]; // 让lastRes取到最后一个值
                } else {
                    (0, _invariant2.default)(false, '[Vanex] ' + curKey + '\u5C5E\u6027\u4E0D\u5B58\u5728\uFF0C\u6CA1\u6CD5\u76F4\u63A5\u8BBE\u7F6E\u3002');
                }
            }

            lastRes[lastKey] = fn(val, lastKey);
        } else {
            result[key] = fn(val, key);
        }

        return result;
    }, res);
}

/**
 * @param {*} val
 * @returns {Promise}
 */
function toPromise(val) {
    if (val && typeof val.then === 'function') {
        return val;
    }
    return _promise2.default.resolve(val);
}

function toObservableObj() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return mapValues(obj, function (item) {
        return (0, _mobx.observable)(item);
    });
}

function each() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var fn = arguments[1];

    (0, _keys2.default)(obj).forEach(function (key) {
        fn(obj[key], key);
    });
}
var isFunction = exports.isFunction = function isFunction(arg) {
    return toString.call(arg) === '[object Function]';
};
var isRegExp = exports.isRegExp = function isRegExp(arg) {
    return toString.call(arg) === '[object RegExp]';
};
var isObject = exports.isObject = function isObject(arg) {
    return toString.call(arg) === '[object Object]';
};

function compose(arr, arg) {
    return arr.reduce(function (cur, fn) {
        return cur.then(function (res) {
            return fn(res);
        });
    }, _promise2.default.resolve(arg));
}

function nameToUpperCase() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return name[0].toUpperCase() + name.slice(1);
}

function inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + (typeof superClass === 'undefined' ? 'undefined' : (0, _typeof3.default)(superClass)));
    }
    subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    if (superClass) {
        if (_setPrototypeOf2.default) {
            (0, _setPrototypeOf2.default)(subClass, superClass);
        } else {
            subClass.__proto__ = superClass;
        }
    }
}

function classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : (0, _typeof3.default)(call)) === 'object' || typeof call === 'function') ? call : self;
}