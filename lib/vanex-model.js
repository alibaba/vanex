'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.toMobxSyncActions = toMobxSyncActions;
exports.toMobxAsyncActions = toMobxAsyncActions;
exports.isMobxModelClass = isMobxModelClass;

var _mobx = require('mobx');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var count = 0;

var MobxModel = function () {
    function MobxModel() {
        var initData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var middleware = arguments[1];

        var _this = this;

        var autorunMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var constants = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
        (0, _classCallCheck3.default)(this, MobxModel);

        if (this.constructor !== MobxModel && this.constructor.uuid === (0, _getPrototypeOf2.default)(this.constructor).uuid) {
            throw new Error('[MobxModel] Can not immediately extend from MobxModel.');
        }

        // 保存action状态
        this._actionStates = {};

        // 保存当前传进来的中间件
        this._middleware = middleware;
        this._id = count++;

        (0, _keys2.default)(initData).forEach(function (key) {
            if (constants[key] !== undefined) {
                throw new Error('[MobxModel] data key "' + key + '" is defined in constants');
            }
        });

        // check keys
        this._dataKeys = (0, _keys2.default)(initData).concat((0, _keys2.default)(constants));

        this._checkDataKeys();

        // add constants
        var _constants = (0, _utils.mapValues)(constants, function (value) {
            return {
                enumerable: true,
                configurable: true,
                writable: false,
                value: value
            };
        });

        // 将常量赋值给Model实例
        (0, _defineProperties2.default)(this, _constants);

        // 将initData copy给实例，同时将其转变为observable
        (0, _mobx.extendObservable)(this, initData);

        // 自动执行的函数map
        (0, _utils.each)(autorunMap, function (autorunFn) {
            (0, _mobx.autorun)(autorunFn, _this);
        });
    }

    (0, _createClass3.default)(MobxModel, [{
        key: 'getID',
        value: function getID() {
            return this._id;
        }
    }, {
        key: 'getActionState',
        value: function getActionState(actionName) {
            if (!this[actionName]) {
                throw new Error('[MobxModel] Undefined action: ', actionName);
            }

            if (!this._actionStates[actionName]) {
                this.setActionState(actionName);
            }

            return this._actionStates[actionName];
        }
    }, {
        key: 'toJS',
        value: function toJS(key) {
            var _this2 = this;

            function parse(val) {
                if (val instanceof MobxModel) {
                    return val.toJS();
                }
                if (Array.isArray(val) || (0, _mobx.isObservableArray)(val)) {
                    return val.map(function (item) {
                        return parse(item);
                    });
                } else if ((0, _utils.isRegExp)(val)) {
                    return val;
                } else if (val && (typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'object') {
                    return (0, _utils.mapValues)(val, function (item) {
                        return parse(item);
                    });
                }

                return (0, _mobx.toJS)(val);
            }

            if (key) {
                return parse(this[key]);
            }

            return this._dataKeys.reduce(function (json, key) {
                json[key] = parse(_this2[key]);
                return json;
            }, {});
        }
    }, {
        key: 'toJSON',
        value: function toJSON(key) {
            return this.toJS(key);
        }
    }, {
        key: 'stringify',
        value: function stringify() {
            return (0, _stringify2.default)(this.toJS());
        }
    }, {
        key: 'each',
        value: function each(fn) {
            var _this3 = this;

            this._dataKeys.map(function (key) {
                fn(_this3[key], key, _this3);
            });
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.constructor.name;
        }
    }, {
        key: '_checkDataKeys',
        value: function _checkDataKeys() {
            var _this4 = this;

            this._dataKeys.forEach(function (dataKey) {
                if (_this4[dataKey]) {
                    throw new Error('[MobxModel] Data key "' + dataKey + '" is defined in prototype methods.');
                }
            });
        }
    }, {
        key: 'set',
        value: function set(key, val) {
            var _this5 = this;

            if (typeof key === 'string') {
                this[key] = val;
            } else {
                // 运行一次，在给实例同步的同时，触发React Component的重新渲染
                (0, _mobx.runInAction)(function () {
                    return (0, _utils.deepMapValues)(key, function (item) {
                        return item;
                    }, _this5);
                });
            }

            return this;
        }
    }, {
        key: 'setActionState',
        value: function setActionState(actionName, val) {
            (0, _mobx.extendObservable)(this._actionStates, (0, _defineProperty3.default)({}, actionName, val || {
                loading: false,
                error: null
            }));
        }
    }, {
        key: 'dataKeys',
        get: function get() {
            return this._dataKeys;
        }
    }, {
        key: 'middleware',
        set: function set(middleware) {
            this._middleware = middleware;
        },
        get: function get() {
            return this._middleware;
        }
    }]);
    return MobxModel;
}();

// 同步数据处理


MobxModel.uuid = 0;
exports.default = MobxModel;
function toMobxSyncActions(syncs) {
    return (0, _utils.mapValues)(syncs, function (actionFn, actionName) {
        return function mobxAction() {
            for (var _len = arguments.length, actionArgs = Array(_len), _key = 0; _key < _len; _key++) {
                actionArgs[_key] = arguments[_key];
            }

            return (0, _mobx.action)(actionFn).apply(this, actionArgs);
        };
    });
}

// 对effects的处理
function toMobxAsyncActions(actions) {
    // 其实就是对每一个开发者定义的Model中的action包装成mobxAction
    return (0, _utils.mapValues)(actions, function (actionFn, actionName) {
        return function mobxAction() {
            var _this6 = this;

            for (var _len2 = arguments.length, actionArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                actionArgs[_key2] = arguments[_key2];
            }

            var actionContext = this;

            // 1. add loading state and save the pre error
            this.setActionState(actionName, {
                loading: true,
                error: this.getActionState(actionName).error
            });

            // 2. exec action with hooks
            return this._middleware.execAction({
                actionFn: (0, _mobx.action)(actionFn),
                actionName: actionName,
                actionArgs: actionArgs,
                actionContext: actionContext
            }).then(function (payload) {
                // 3. loaded success
                _this6.setActionState(actionName, {
                    loading: false,
                    error: null
                });

                return payload;
            }).catch(function (error) {
                // 4. loaded error
                _this6.setActionState(actionName, {
                    loading: false,
                    error: error
                });

                throw error;
            });
        };
    });
}

function isMobxModelClass(target) {
    return target === MobxModel || target.prototype instanceof MobxModel;
}