'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Middleware = function () {
    function Middleware(middleware) {
        (0, _classCallCheck3.default)(this, Middleware);
        this.middleware = [];

        this.use(middleware);
    }

    /**
     * Add middleware
     * @param  {Function|Array<Function>} middleware
     */


    (0, _createClass3.default)(Middleware, [{
        key: 'use',
        value: function use() {
            var middleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (!Array.isArray(middleware)) {
                middleware = [middleware];
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(middleware), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var fn = _step.value;

                    if (!(0, _utils.isFunction)(fn)) {
                        throw new TypeError('Middleware must be composed of functions!');
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.middleware = [].concat((0, _toConsumableArray3.default)(this.middleware), (0, _toConsumableArray3.default)(middleware));
        }
    }, {
        key: 'remove',
        value: function remove() {
            var _this = this;

            var middleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (!Array.isArray(middleware)) {
                middleware = [middleware];
            }

            middleware.forEach(function (item) {
                var index = _this.middleware.indexOf(item);
                _this.middleware.splice(index, 1);
            });
        }
    }, {
        key: 'isEmpty',
        value: function isEmpty() {
            return this.middleware.length === 0;
        }

        /**
         * Compose all middleware
         * @param {object} arg
         * @return {Promise}
         */

    }, {
        key: 'compose',
        value: function compose() {
            var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.middleware.reduce(function (pm, fn) {
                return pm.then(function (payload) {
                    return fn((0, _extends3.default)({}, arg, {
                        payload: payload
                    }));
                });
            }, _promise2.default.resolve(arg.payload));
        }
    }]);
    return Middleware;
}();

exports.default = Middleware;
module.exports = exports['default'];