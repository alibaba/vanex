'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _middleware2 = require('./middleware');

var _middleware3 = _interopRequireDefault(_middleware2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var KEYS = ['before', 'after', 'error', 'filter'];

function toFilter(filter) {
    if ((0, _utils.isRegExp)(filter)) {
        return function (_ref) {
            var type = _ref.type;
            return filter.test(type);
        };
    } else if (typeof filter === 'string') {
        return function (_ref2) {
            var type = _ref2.type;
            return filter === type;
        };
    } else if (typeof filter === 'function') {
        return filter;
    }
    throw new TypeError('[ComposeMiddleware] Middleware filter must be RegExp, String or Function.');
}

var ComposeMiddleware = function () {
    (0, _createClass3.default)(ComposeMiddleware, null, [{
        key: 'toStandardMiddleware',
        value: function toStandardMiddleware() {
            var _middleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (typeof _middleware === 'function') {
                return {
                    after: _middleware
                };
            } else if ((typeof _middleware === 'undefined' ? 'undefined' : (0, _typeof3.default)(_middleware)) === 'object') {
                var middleware = {};
                (0, _keys2.default)(_middleware).forEach(function (key) {
                    if (!KEYS.includes(key)) {
                        throw new Error('[ComposeMiddleware] Middleware key must one of "' + KEYS.join(' ,') + '"');
                    }
                    // filter empty middleware
                    if (_middleware[key]) {
                        middleware[key] = _middleware[key];
                    }
                });

                if (middleware.filter) {
                    var filter = toFilter(middleware.filter);
                    delete middleware.filter;
                    // to filter function
                    return (0, _utils.mapValues)(middleware, function (res) {
                        res = Array.isArray(res) ? res : [res];
                        return res.map(function (fn) {
                            return function middlewareFilterMixin(_ref3) {
                                var payload = _ref3.payload;

                                if (!filter.apply(undefined, arguments)) return payload;
                                return fn.apply(undefined, arguments);
                            };
                        });
                    }, {});
                }
                return middleware;
            }
            throw new TypeError('[ComposeMiddleware] Middleware must be a function or object but get ' + _middleware);
        }
    }]);

    function ComposeMiddleware() {
        (0, _classCallCheck3.default)(this, ComposeMiddleware);

        this._before = new _middleware3.default();
        this._after = new _middleware3.default();
        this._error = new _middleware3.default();
    }

    (0, _createClass3.default)(ComposeMiddleware, [{
        key: 'use',
        value: function use() {
            var _this = this;

            var removes = [];

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (middleware) {
                middleware = ComposeMiddleware.toStandardMiddleware(middleware);
                (0, _keys2.default)(middleware).forEach(function (pos) {
                    var cur = _this['_' + pos]; // before | after | error
                    cur.use(middleware[pos]);
                    removes.push(function () {
                        return cur.remove(middleware[pos]);
                    });
                });
            });

            return function removeMiddlewares() {
                removes.map(function (rm) {
                    return rm();
                });
            };
        }
    }, {
        key: 'execAction',
        value: function execAction(_ref4) {
            var _this2 = this;

            var actionFn = _ref4.actionFn,
                _ref4$actionArgs = _ref4.actionArgs,
                actionArgs = _ref4$actionArgs === undefined ? [] : _ref4$actionArgs,
                actionName = _ref4.actionName,
                actionContext = _ref4.actionContext;

            var args = {
                action: actionName,
                model: actionContext,
                type: actionContext + '.' + actionName
            };

            return this._before.compose((0, _extends3.default)({}, args, {
                payload: actionArgs,
                pos: 'before'
            })).then(function (args) {
                if (!Array.isArray(args)) {
                    throw new Error('[ComposeMiddleware] Pre middleware must return arguments');
                }

                return actionFn.apply(actionContext, args);
            }).then(function (payload) {
                return _this2._after.compose((0, _extends3.default)({}, args, {
                    payload: payload,
                    pos: 'after'
                }));
            }).catch(function (error) {
                return _this2._error.compose((0, _extends3.default)({}, args, {
                    payload: error,
                    pos: 'error'
                })).then(function (error) {
                    if (error instanceof Error) {
                        throw error;
                    }
                    return error;
                });
            });
        }
    }]);
    return ComposeMiddleware;
}();

exports.default = ComposeMiddleware;
module.exports = exports['default'];