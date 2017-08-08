__def('@alife/vanex/0.x/index', ['require', 'mobx/3.x/index', 'mobx-react/4.x/index', 'react/15.x/index', 'invariant/2.x/index', 'is-plain-object/2.x/index', 'react-dom/15.x/index'], function(require) {
  return require('QGFsaWZlL3ZhbmV4LzAueC9pbmRleA==');
});
__def('QGFsaWZlL3ZhbmV4LzAueC9pbmRleA==', ['require', 'module', '@alife/vanex/0.x/src/index'], function (require, module) {
  module.exports = require('@alife/vanex/0.x/src/index');
});
__def('@alife/vanex/0.x/src/plugin/index', ['require', 'module', 'exports', 'invariant/2.x/index', 'is-plain-object/2.x/index'], function (require, module, exports, _index, _index3) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _index2 = _interopRequireDefault(_index);

    var _index4 = _interopRequireDefault(_index3);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Plugin = function () {
        function Plugin() {
            _classCallCheck(this, Plugin);

            this.hooks = {
                onStateChange: [],
                onAction: [],
                onEffect: [],
                onError: [],
                beforeConnectStore: [],
                beforeSet: []
            };
        }

        Plugin.prototype.use = function use(plugin) {
            (0, _index2.default)((0, _index4.default)(plugin), 'plugin.use: plugin should be plain object');
            var hooks = this.hooks;

            for (var key in plugin) {
                if (Object.prototype.hasOwnProperty.call(plugin, key)) {
                    (0, _index2.default)(hooks[key], 'plugin.use: unknown plugin property: ' + key);
                    if (key === 'extraEnhancers') {
                        hooks[key] = plugin[key];
                    } else {
                        hooks[key].push(plugin[key]);
                    }
                }
            }
        };

        Plugin.prototype.apply = function apply(key, defaultHandler) {
            var hooks = this.hooks;
            var validApplyHooks = ['onError', 'onStateChange', 'onAction', 'beforeConnectStore', 'beforeSet'];
            (0, _index2.default)(validApplyHooks.indexOf(key) > -1, 'plugin.apply: hook ' + key + ' cannot be applied');
            var fns = hooks[key];

            return function () {
                if (fns.length) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = fns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var fn = _step.value;

                            fn.apply(undefined, arguments);
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
                } else if (defaultHandler) {
                    defaultHandler.apply(undefined, arguments);
                }
            };
        };

        Plugin.prototype.get = function get(key) {
            var hooks = this.hooks;
            (0, _index2.default)(key in hooks, 'plugin.get: hook ' + key + ' cannot be got');
            if (key === 'extraReducers') {
                var ret = {};
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = hooks[key][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var reducerObj = _step2.value;

                        ret = _extends({}, ret, reducerObj);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return ret;
            } else if (key === 'onReducer') {
                return function (reducer) {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = hooks[key][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var reducerEnhancer = _step3.value;

                            reducer = reducerEnhancer(reducer);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    return reducer;
                };
            } else {
                return hooks[key];
            }
        };

        return Plugin;
    }();

    exports.default = Plugin;
    module.exports = exports['default'];
});
__def('@alife/vanex/0.x/src/utils', ['require', 'exports', 'invariant/2.x/index', 'mobx/3.x/index'], function (require, exports, _index, _index3) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.isObject = exports.isRegExp = exports.isFunction = undefined;
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

    var _index2 = _interopRequireDefault(_index);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _defaults(obj, defaults) {
        var keys = Object.getOwnPropertyNames(defaults);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = Object.getOwnPropertyDescriptor(defaults, key);

            if (value && value.configurable && obj[key] === undefined) {
                Object.defineProperty(obj, key, value);
            }
        }

        return obj;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

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

        return Object.keys(obj).reduce(function (result, key) {
            var curRes = fn(obj[key], key);
            result[key] = curRes;

            return result;
        }, res);
    }

    function deepMapValues(obj, fn) {
        var res = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        return Object.keys(obj).reduce(function (result, key) {
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
                        (0, _index2.default)(false, '[Vanex] ' + curKey + '\u5C5E\u6027\u4E0D\u5B58\u5728\uFF0C\u6CA1\u6CD5\u76F4\u63A5\u8BBE\u7F6E\u3002');
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
        return Promise.resolve(val);
    }

    function toObservableObj() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return mapValues(obj, function (item) {
            return (0, _index3.observable)(item);
        });
    }

    function each() {
        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var fn = arguments[1];

        Object.keys(obj).forEach(function (key) {
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
        }, Promise.resolve(arg));
    }

    function nameToUpperCase() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        return name[0].toUpperCase() + name.slice(1);
    }

    function inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
            throw new TypeError('Super expression must either be null or a function, not ' + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
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
                _defaults(subClass, superClass);
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

        return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === 'object' || typeof call === 'function') ? call : self;
    }
});
__def('@alife/vanex/0.x/src/vanex-model', ['require', 'exports', 'mobx/3.x/index', '@alife/vanex/0.x/src/utils'], function (require, exports, _index, _utils) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;
    exports.toMobxSyncActions = toMobxSyncActions;
    exports.toMobxAsyncActions = toMobxAsyncActions;
    exports.isMobxModelClass = isMobxModelClass;

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var _class, _temp;

    var count = 0;

    var MobxModel = (_temp = _class = function () {
        function MobxModel() {
            var initData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var middleware = arguments[1];
            var plugin = arguments[2];

            var _this = this;

            var autorunMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
            var constants = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

            _classCallCheck(this, MobxModel);

            if (this.constructor !== MobxModel && this.constructor.uuid === Object.getPrototypeOf(this.constructor).uuid) {
                throw new Error('[Vanex] Can not immediately extend from MobxModel.');
            }

            // 保存action状态
            this._actionStates = {};

            // 保存当前传进来的中间件
            this._middleware = middleware;
            this._plugin = plugin;

            this._id = count++;

            Object.keys(initData).forEach(function (key) {
                if (constants[key] !== undefined) {
                    throw new Error('[MobxModel] data key "' + key + '" is defined in constants');
                }
            });

            // check keys
            this._dataKeys = Object.keys(initData).concat(Object.keys(constants));

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
            Object.defineProperties(this, _constants);

            (0, _index.extendObservable)(this, initData);

            // 初始化 computed

            var computedMap = this.computed || [];
            // const mobxComputeds = mapValues(computedMap, value => computed(value));

            (0, _index.extendObservable)(this, computedMap);

            // 自动执行的函数map
            (0, _utils.each)(autorunMap, function (autorunFn) {
                (0, _index.autorun)(autorunFn, _this);
            });

            // 监听state数据状态变化钩子
            if (this._plugin.hooks.onStateChange.length) {
                (0, _index.spy)(this._plugin.apply('onStateChange'));
            }
        }

        MobxModel.prototype.getID = function getID() {
            return this._id;
        };

        MobxModel.prototype.toJS = function toJS(key) {
            var _this2 = this;

            function parse(val) {
                if (val instanceof MobxModel) {
                    return val.toJS();
                }
                if (Array.isArray(val) || (0, _index.isObservableArray)(val)) {
                    return val.map(function (item) {
                        return parse(item);
                    });
                } else if ((0, _utils.isRegExp)(val)) {
                    return val;
                } else if (val && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
                    return (0, _utils.mapValues)(val, function (item) {
                        return parse(item);
                    });
                }

                return (0, _index.toJS)(val);
            }

            if (key) {
                return parse(this[key]);
            }

            return this._dataKeys.reduce(function (json, key) {
                json[key] = parse(_this2[key]);

                return json;
            }, {});
        };

        MobxModel.prototype.toJSON = function toJSON(key) {
            return this.toJS(key);
        };

        MobxModel.prototype.stringify = function stringify() {
            return JSON.stringify(this.toJS());
        };

        MobxModel.prototype.each = function each(fn) {
            var _this3 = this;

            this._dataKeys.map(function (key) {
                fn(_this3[key], key, _this3);
            });
        };

        MobxModel.prototype.toString = function toString() {
            return this.constructor.name;
        };

        MobxModel.prototype._checkDataKeys = function _checkDataKeys() {
            var _this4 = this;

            this._dataKeys.forEach(function (dataKey) {
                if (_this4[dataKey]) {
                    throw new Error('[MobxModel] Data key "' + dataKey + '" is defined in prototype methods.');
                }
            });
        };

        MobxModel.prototype.set = function set(key, val) {
            var _this5 = this;

            if (this._plugin.hooks.beforeSet.length) {
                var change = {};
                if (typeof key === 'string') {
                    change[key] = val;
                } else {
                    change = key;
                }

                this._plugin.apply('beforeSet')({
                    change: change,
                    object: this
                });
            }
            if (typeof key === 'string') {
                this[key] = val;
            } else {
                // 运行一次，在给实例同步的同时，触发React Component的重新渲染
                (0, _index.runInAction)(function () {
                    return (0, _utils.deepMapValues)(key, function (item) {
                        return item;
                    }, _this5);
                });
            }
            return this;
        };

        MobxModel.prototype.getActionState = function getActionState(actionName) {
            if (actionName.split('/') === -1) {
                throw new Error('[MobxModel] Please specify your model name as "model/action": ' + actionName);
            }

            if (!this[actionName.split('/')[1]]) {
                throw new Error('[MobxModel] Undefined action: ' + actionName);
            }

            if (!this._actionStates[actionName]) {
                this.setActionState(actionName);
            }

            return this._actionStates[actionName];
        };

        MobxModel.prototype.setActionState = function setActionState(actionName, val) {
            (0, _index.extendObservable)(this._actionStates, _defineProperty({}, actionName, val || {
                loading: false,
                error: null
            }));
        };

        _createClass(MobxModel, [{
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
    }(), _class.uuid = 0, _temp);
    exports.default = MobxModel;


    // 同步数据处理
    function toMobxSyncActions(name, syncs, plugin) {
        return (0, _utils.mapValues)(syncs, function (actionFn, actionName) {
            return function mobxAction() {
                for (var _len = arguments.length, actionArgs = Array(_len), _key = 0; _key < _len; _key++) {
                    actionArgs[_key] = arguments[_key];
                }

                // 执行钩子函数
                var result = (0, _index.action)(actionFn).apply(this, actionArgs);

                if (plugin.hooks.onAction.length) {
                    plugin.apply('onAction')({
                        actionName: actionName,
                        actionArgs: actionArgs,
                        result: result
                    });
                }

                return result;
            };
        });
    }

    // 对effects的处理
    function toMobxAsyncActions(modelName, actions) {
        // 其实就是对每一个开发者定义的Model中的action包装成mobxAction
        return (0, _utils.mapValues)(actions, function (actionFn, actionName) {
            actionName = modelName + '/' + actionName;

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
                    actionFn: (0, _index.action)(actionFn),
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
});
__def('@alife/vanex/0.x/src/vanex-relation', ['require', 'module', 'exports', '@alife/vanex/0.x/src/utils', 'mobx/3.x/index'], function (require, module, exports, _utils, _index) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;

    var _slicedToArray = function () {
        function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;

            try {
                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                    _arr.push(_s.value);

                    if (i && _arr.length === i) break;
                }
            } catch (err) {
                _d = true;
                _e = err;
            } finally {
                try {
                    if (!_n && _i["return"]) _i["return"]();
                } finally {
                    if (_d) throw _e;
                }
            }

            return _arr;
        }

        return function (arr, i) {
            if (Array.isArray(arr)) {
                return arr;
            } else if (Symbol.iterator in Object(arr)) {
                return sliceIterator(arr, i);
            } else {
                throw new TypeError("Invalid attempt to destructure non-iterable instance");
            }
        };
    }();

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var emptyFn = function emptyFn() {};

    function spliter(target, keys, fn) {
        if (keys.length === 0) {
            return fn(target);
        }

        return target.split(keys[0]).map(function (item) {
            return spliter(item, keys.slice(1), fn);
        }).filter(function (item) {
            return item;
        });
    }

    function isActionKey(key) {
        return key && key.split('.').length === 2;
    }

    function checkFilters(filters) {
        if ((typeof filters === 'undefined' ? 'undefined' : _typeof(filters)) === 'object') {
            Object.keys(filters).forEach(function (key) {
                var filter = filters[key];
                if (typeof filter !== 'function') {
                    throw new TypeError('[MobxRelation] filters "' + key + '" must be a function');
                }
            });
        } else {
            throw new TypeError('[MobxRelation] filters must be an Object.');
        }
    }
    /**
     * regexp support
     */

    var MobxRelation = function () {
        function MobxRelation() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, MobxRelation);

            this._relations = [];
            this._filters = {};
            this._inits = [];
            this._autoruns = [];
            this.addFilters(opts.filters);
        }

        MobxRelation.prototype.addFilters = function addFilters() {
            var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            checkFilters(filters);
            this._filters = _extends({}, this._filters, filters);
        };

        MobxRelation.prototype.init = function init(initFn) {
            if (typeof initFn === 'function') {
                this._inits.push(initFn);
            } else {
                throw new Error('[MobxRelation] Relation init need a function but get ' + (typeof initFn === 'undefined' ? 'undefined' : _typeof(initFn)) + '.');
            }
        };

        MobxRelation.prototype.use = function use() {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (fn) {
                if (typeof fn === 'function') {
                    fn(_this);
                } else {
                    throw new Error('[MobxRelation] relation.use need functions but get ' + (typeof fn === 'undefined' ? 'undefined' : _typeof(fn)) + '.');
                }
            });
        };

        MobxRelation.prototype.autorun = function autorun(_autorun) {
            if (typeof _autorun === 'function') {
                this._autoruns.push(_autorun);
            } else {
                throw new Error('[MobxRelation] Relation autorun need a function.');
            }
        };

        MobxRelation.prototype.triggerAutorun = function triggerAutorun(context) {
            this._autoruns.forEach(function (fn) {
                (0, _index.autorun)(fn.bind(null, context.data));
            });
        };

        MobxRelation.prototype.triggerInit = function triggerInit(context) {
            this._inits.forEach(function (fn) {
                return fn(context.data);
            });
        };

        MobxRelation.prototype.listen = function listen(patterns, fn, errorFn) {
            var _this2 = this;

            if (typeof patterns === 'string') {
                patterns = patterns.split(/\r?\n/)
                // filter "#..." comments
                .filter(function (item) {
                    return item && !/^\s*#.*$/.test(item);
                }).join('').replace(/\s*/g, '').split(';').filter(function (item) {
                    return item;
                });
                if (patterns.length === 0) {
                    throw new Error('[MobxRelation] Relation pattern can not be empty.');
                }
                patterns.forEach(function (pattern) {
                    return _this2._addRelation(pattern, fn, errorFn);
                });
            } else if ((0, _utils.isRegExp)(patterns)) {
                this._addRelation(patterns, fn, errorFn);
            } else {
                throw new Error('[MobxRelation] Listen pattern must be a String or RegExp.');
            }
            return this;
        };

        MobxRelation.prototype.execInMiddleware = function execInMiddleware(_ref) {
            var _this3 = this;

            var fullname = _ref.fullname,
                payload = _ref.payload,
                context = _ref.context;

            context = _extends({}, context.data);
            this._relations.forEach(function (_ref2) {
                var pattern = _ref2.pattern,
                    fn = _ref2.fn,
                    errorFn = _ref2.errorFn;

                var chain = [];

                if (!(0, _utils.isRegExp)(pattern.action) && fullname !== pattern.action || (0, _utils.isRegExp)(pattern.action) && !pattern.action.test(fullname)) {
                    return;
                }

                try {
                    pattern.chain.forEach(function (item, index) {
                        chain = chain.concat(item);
                        if (pattern.chain.length - 1 !== index) {
                            chain.push(emptyFn);
                        }
                    });

                    chain = chain.map(function (key) {
                        if (typeof key === 'string') {
                            if (isActionKey(key)) {
                                var _key$split = key.split('.'),
                                    _key$split2 = _slicedToArray(_key$split, 2),
                                    name = _key$split2[0],
                                    action = _key$split2[1];

                                var model = context[name];
                                if (model && model[action]) {
                                    return model[action].bind(model);
                                }
                                throw new Error('[MobxRelation] Action "' + key + '" is not defined.');
                            }
                            return _this3._filters[key];
                        }
                        return key;
                    });

                    (0, _utils.compose)(chain, payload).then(function (res) {
                        return fn({ context: context, payload: res, action: fullname });
                    }).catch(function (e) {
                        return errorFn({ context: context, payload: e, action: fullname });
                    });
                } catch (e) {
                    errorFn({ context: context, payload: e, action: fullname });
                }
            });
        };

        MobxRelation.prototype.parsePattern = function parsePattern(pattern) {
            var _this4 = this;

            if ((0, _utils.isRegExp)(pattern)) {
                return { action: pattern, refs: [], chain: [] };
            }
            pattern = pattern.replace(/\s*/g, '');
            if (!pattern) {
                throw new Error('[MobxRelation] Relation pattern can not be empty.');
            }
            if (!/^[\#\-\>\=\.a-zA-Z_0-9\|]+$/.test(pattern)) {
                throw new Error('[MobxRelation] Relation pattern "' + pattern + '" illegal.');
            }
            var refs = [];
            var chain = spliter(pattern, ['->', /\=\>|\|/], function (key) {
                if (isActionKey(key)) {
                    var modelName = key.split('.')[0];
                    if (!refs.includes(modelName)) refs.push(modelName);
                } else if (key && !_this4._filters[key]) {
                    throw new Error('[MobxRelation] Undefined filter "' + key + '"');
                }
                return key;
            }).filter(function (item) {
                return item.length !== 0;
            });
            var action = chain[0][0];
            if (!action || !isActionKey(action)) {
                throw new Error('[MobxRelation] Relation pattern need an dispatcher action.');
            }
            chain[0] = chain[0].slice(1);
            return { action: action, refs: refs, chain: chain };
        };

        MobxRelation.prototype._addRelation = function _addRelation(pattern, fn, errorFn) {
            pattern = this.parsePattern(pattern);
            this._relations.push({
                pattern: pattern,
                fn: fn || emptyFn,
                errorFn: errorFn || function (_ref3) {
                    var payload = _ref3.payload;

                    throw payload;
                }
            });
        };

        return MobxRelation;
    }();

    exports.default = MobxRelation;
    module.exports = exports['default'];
});
__def('@alife/vanex/0.x/src/create-model', ['require', 'module', 'exports', '@alife/vanex/0.x/src/vanex-model', '@alife/vanex/0.x/src/utils'], function (require, module, exports, _vanexModel, _utils) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = createModel;

    var _vanexModel2 = _interopRequireDefault(_vanexModel);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _objectWithoutProperties(obj, keys) {
        var target = {};

        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }

        return target;
    }

    var uuid = 0;

    function createModel(_ref) {
        var Parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _vanexModel2.default;

        var name = _ref.name,
            _ref$data = _ref.data,
            data = _ref$data === undefined ? {} : _ref$data,
            _ref$constants = _ref.constants,
            constants = _ref$constants === undefined ? {} : _ref$constants,
            _ref$privates = _ref.privates,
            privates = _ref$privates === undefined ? {} : _ref$privates,
            _ref$autorun = _ref.autorun,
            autorun = _ref$autorun === undefined ? {} : _ref$autorun,
            _ref$syncs = _ref.syncs,
            syncs = _ref$syncs === undefined ? {} : _ref$syncs,
            _ref$effects = _ref.effects,
            effects = _ref$effects === undefined ? {} : _ref$effects,
            others = _objectWithoutProperties(_ref, ['name', 'data', 'constants', 'privates', 'autorun', 'syncs', 'effects']);

        if (!(0, _vanexModel.isMobxModelClass)(Parent)) {
            throw new Error('[createModel] Parent class must extend From MobxModel.');
        }
        if (!name) {
            throw new Error('[createModel] need a name.');
        }

        function MobxModel() {
            var _initData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var middleware = arguments[1];
            var plugin = arguments[2];
            var _autorun = arguments[3];
            var _constants = arguments[4];

            (0, _utils.classCallCheck)(this, MobxModel);

            if (typeof data === 'function') {
                throw new Error('[createModel] `data` can not be a function, please use `init` instead.');
            }

            var mobxSyncs = (0, _vanexModel.toMobxSyncActions)(name, syncs, plugin);
            var mobxAsyncs = (0, _vanexModel.toMobxAsyncActions)(name, effects, plugin);

            _extends(this, mobxSyncs, mobxAsyncs);

            // Object.getPrototypeOf(MobxModel)指向_MobxModel的构造函数
            var res = (0, _utils.possibleConstructorReturn)(this, Object.getPrototypeOf(MobxModel).call(this, _extends({}, data, _initData), middleware, plugin, _extends({}, autorun, _autorun), _extends({}, constants, _constants)));

            return res;
        }

        MobxModel.uuid = ++uuid;
        MobxModel.syncs = syncs;
        MobxModel.effects = effects;
        MobxModel.autorun = autorun;

        (0, _utils.inherits)(MobxModel, Parent);

        // Define MobxModel name
        Object.defineProperties(MobxModel, {
            name: {
                enumerable: false,
                configurable: true,
                writable: false,
                value: (0, _utils.nameToUpperCase)(name)
            }
        });

        MobxModel.prototype = _extends(MobxModel.prototype, others, privates);

        return MobxModel;
    }
    module.exports = exports['default'];
});
__def('@alife/vanex/0.x/src/middleware', ['require', 'module', 'exports', '@alife/vanex/0.x/src/utils'], function (require, module, exports, _utils) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Middleware = function () {
        function Middleware(middleware) {
            _classCallCheck(this, Middleware);

            this.middleware = [];

            this.use(middleware);
        }

        /**
         * Add middleware
         * @param  {Function|Array<Function>} middleware
         */


        Middleware.prototype.use = function use() {
            var middleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (!Array.isArray(middleware)) {
                middleware = [middleware];
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = middleware[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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

            this.middleware = [].concat(_toConsumableArray(this.middleware), _toConsumableArray(middleware));
        };

        Middleware.prototype.remove = function remove() {
            var _this = this;

            var middleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            if (!Array.isArray(middleware)) {
                middleware = [middleware];
            }

            middleware.forEach(function (item) {
                var index = _this.middleware.indexOf(item);
                _this.middleware.splice(index, 1);
            });
        };

        Middleware.prototype.isEmpty = function isEmpty() {
            return this.middleware.length === 0;
        };

        Middleware.prototype.compose = function compose() {
            var arg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            return this.middleware.reduce(function (pm, fn) {
                return pm.then(function (payload) {
                    return fn(_extends({}, arg, {
                        payload: payload
                    }));
                });
            }, Promise.resolve(arg.payload));
        };

        return Middleware;
    }();

    exports.default = Middleware;
    module.exports = exports['default'];
});
__def('@alife/vanex/0.x/src/vanex-middleware', ['require', 'exports', '@alife/vanex/0.x/src/utils', '@alife/vanex/0.x/src/middleware'], function (require, exports, _utils, _middleware2) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.ComposeMiddleware = undefined;

    var _middleware3 = _interopRequireDefault(_middleware2);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

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

    var ComposeMiddleware = exports.ComposeMiddleware = function () {
        ComposeMiddleware.toStandardMiddleware = function toStandardMiddleware() {
            var _middleware = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            if (typeof _middleware === 'function') {
                return {
                    after: _middleware
                };
            } else if ((typeof _middleware === 'undefined' ? 'undefined' : _typeof(_middleware)) === 'object') {
                var middleware = {};
                Object.keys(_middleware).forEach(function (key) {
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

                                if (!filter.apply(undefined, arguments)) {
                                    return payload;
                                }

                                return fn.apply(undefined, arguments);
                            };
                        });
                    }, {});
                }
                return middleware;
            }
            throw new TypeError('[ComposeMiddleware] Middleware must be a function or object but get ' + _middleware);
        };

        function ComposeMiddleware() {
            _classCallCheck(this, ComposeMiddleware);

            this._before = new _middleware3.default();
            this._after = new _middleware3.default();
            this._error = new _middleware3.default();
        }

        ComposeMiddleware.prototype.use = function use() {
            var _this = this;

            var removes = [];

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (middleware) {
                middleware = ComposeMiddleware.toStandardMiddleware(middleware);
                Object.keys(middleware).forEach(function (pos) {
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
        };

        ComposeMiddleware.prototype.execAction = function execAction(_ref4) {
            var _this2 = this;

            var actionFn = _ref4.actionFn,
                _ref4$actionArgs = _ref4.actionArgs,
                actionArgs = _ref4$actionArgs === undefined ? [] : _ref4$actionArgs,
                actionName = _ref4.actionName,
                actionContext = _ref4.actionContext;

            var args = {
                action: actionContext + '/' + actionName,
                model: actionContext,
                type: actionContext + '.' + actionName
            };

            return this._before.compose(_extends({}, args, {
                payload: actionArgs,
                pos: 'before'
            })).then(function (args) {
                if (!Array.isArray(args)) {
                    throw new Error('[ComposeMiddleware] Pre middleware must return arguments');
                }

                return actionFn.apply(actionContext, args);
            }).then(function (payload) {
                return _this2._after.compose(_extends({}, args, {
                    payload: payload,
                    pos: 'after'
                }));
            }).catch(function (error) {
                return _this2._error.compose(_extends({}, args, {
                    payload: error,
                    pos: 'error'
                })).then(function (error) {
                    if (error instanceof Error) {
                        throw error;
                    }
                    return error;
                });
            });
        };

        return ComposeMiddleware;
    }();

    exports.default = new ComposeMiddleware();
});
__def('@alife/vanex/0.x/src/vanex-context', ['require', 'module', 'exports', '@alife/vanex/0.x/src/vanex-model', '@alife/vanex/0.x/src/utils', '@alife/vanex/0.x/src/vanex-relation', '@alife/vanex/0.x/src/create-model', '@alife/vanex/0.x/src/vanex-middleware'], function (require, module, exports, _vanexModel, _utils, _vanexRelation, _createModel, _vanexMiddleware) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = undefined;

    var _vanexModel2 = _interopRequireDefault(_vanexModel);

    var _vanexRelation2 = _interopRequireDefault(_vanexRelation);

    var _createModel2 = _interopRequireDefault(_createModel);

    var _vanexMiddleware2 = _interopRequireDefault(_vanexMiddleware);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var MobxContext = function () {
        /**
         * @param {Object} models
         * @param {Object} opts
         *    - parentContext
         *    - middleware
         *    - relation
         */
        function MobxContext() {
            var _this = this;

            var models = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            _classCallCheck(this, MobxContext);

            this._middleware = opts.middleware || _vanexMiddleware2.default;
            this._relation = opts.relation || new _vanexRelation2.default();
            this._plugin = opts.plugin;

            this._models = {};

            this.models = models;

            this.setData(models);

            this._addRelationMiddleware();

            // trigger relation init function in async
            setTimeout(function () {
                _this._relation.triggerInit(_this);
                _this._relation.triggerAutorun(_this);
            });
        }

        MobxContext.prototype.setData = function setData(models) {
            var _this2 = this;

            this._data = _extends({}, this._data, (0, _utils.mapValues)(models, function (Model) {
                if ((0, _utils.isObject)(Model)) {
                    Model = (0, _createModel2.default)(Model);
                }

                // Get a class
                if ((0, _vanexModel.isMobxModelClass)(Model)) {
                    var result = new Model(null, _this2._middleware, _this2._plugin);
                    return result;
                }

                // Get an instance
                if (Model instanceof _vanexModel2.default) {
                    // update model's middleware
                    Model.middleware = _this2._middleware;
                    Model._plugin = _this2._plugin;
                    return Model;
                }
            }));
        };

        MobxContext.prototype.addModel = function addModel(models) {
            this.models = models;

            this.setData(models);
        };

        MobxContext.prototype._addRelationMiddleware = function _addRelationMiddleware() {
            var _this3 = this;

            if (this._relationRemove) {
                return;
            }

            var hook = function hook(arg) {
                var fullname = _this3._findKeyByModel(arg.model) + '.' + arg.action;

                // exec async
                setTimeout(function () {
                    _this3._relation.execInMiddleware(_extends({}, arg, {
                        fullname: fullname,
                        context: _this3
                    }));
                });

                return arg.payload;
            };

            // 在这里设置了relation进去，使得在中间件执行结束后会自动执行这里的hook
            this._relationRemove = this._middleware.use({
                after: hook
            });
        };

        MobxContext.prototype.destroy = function destroy() {
            // remove relation middleware
            if (this._relationRemove) {
                this._relationRemove();
                this._relationRemove = null;
            }
        };

        MobxContext.prototype.checkMobxModels = function checkMobxModels(mobxModels) {
            var _this4 = this;

            if (Array.isArray(mobxModels)) {
                mobxModels.forEach(function (name) {
                    if (!_this4._data[name]) {
                        throw new Error('[@observer] Can not find data "' + name + '" in MobxContext.');
                    }
                });
            } else {
                (0, _utils.each)(mobxModels, function (MobxModel, name) {
                    if (_this4._data[name]) {
                        if (!(0, _vanexModel.isMobxModelClass)(MobxModel)) {
                            throw new TypeError('[@observer] MobxContext required MobxModel class.');
                        }
                        if (!(_this4._data[name] instanceof MobxModel)) {
                            throw new TypeError('[@observer] ' + name + ' is not instance of ' + MobxModel.name + '.');
                        }
                    } else {
                        throw new Error('[@observer] Can not find data "' + name + '" in MobxContext.');
                    }
                });
            }
        };

        MobxContext.prototype.pick = function pick() {
            var _this5 = this;

            for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
                keys[_key] = arguments[_key];
            }

            return keys.reduce(function (obj, key) {
                if (!_this5._data[key]) throw new Error('[MobxContext] Can not find data "' + key + '" in MobxContext.');
                obj[key] = _this5._data[key];
                return obj;
            }, {});
        };

        MobxContext.prototype.find = function find(key) {
            if (!this._data[key]) throw new Error('[MobxContext] Can not find data "' + key + '" in MobxContext.');
            return this._data[key];
        };

        MobxContext.prototype._findKeyByModel = function _findKeyByModel(model) {
            var _this6 = this;

            return Object.keys(this._data).find(function (key) {
                return _this6._data[key] === model;
            });
        };

        _createClass(MobxContext, [{
            key: 'models',
            set: function set(models) {
                var _this7 = this;

                // 校验是否重名
                Object.keys(models).some(function (key) {
                    if (key in _this7._models) {
                        console.error('[vanex]: You have already existed the same model key: \'' + key + '\'');

                        return true;
                    }
                });

                this._models = _extends(this._models || {}, models);
            }
        }, {
            key: 'relation',
            set: function set(newRelation) {
                this._relation = newRelation;
            },
            get: function get() {
                return this._relation;
            }
        }, {
            key: 'middleware',
            get: function get() {
                return this._middleware;
            }
        }, {
            key: 'data',
            get: function get() {
                return this._data;
            }
        }]);

        return MobxContext;
    }();

    exports.default = MobxContext;
    module.exports = exports['default'];
});
__def('@alife/vanex/0.x/src/start', ['require', 'exports', 'react/15.x/index', '@alife/vanex/0.x/src/plugin/index', 'mobx-react/4.x/index', '@alife/vanex/0.x/src/vanex-context', '@alife/vanex/0.x/src/vanex-relation', '@alife/vanex/0.x/src/vanex-middleware', 'react-dom/15.x/index'], function (require, exports, _index, _index3, _index5, _vanexContext, _vanexRelation, _vanexMiddleware, _index6) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.addModel = addModel;
    exports.use = use;

    var _index2 = _interopRequireDefault(_index);

    var _index4 = _interopRequireDefault(_index3);

    var _vanexContext2 = _interopRequireDefault(_vanexContext);

    var _vanexRelation2 = _interopRequireDefault(_vanexRelation);

    var _vanexMiddleware2 = _interopRequireDefault(_vanexMiddleware);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _defaults(obj, defaults) {
        var keys = Object.getOwnPropertyNames(defaults);

        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = Object.getOwnPropertyDescriptor(defaults, key);

            if (value && value.configurable && obj[key] === undefined) {
                Object.defineProperty(obj, key, value);
            }
        }

        return obj;
    }

    function _objectWithoutProperties(obj, keys) {
        var target = {};

        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }

        return target;
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass);
    }

    var globalPlugin = new _index4.default();

    var context;
    var started = false;

    exports.default = function (_ref) {
        var ContainerComponent = _ref.component,
            models = _ref.models,
            container = _ref.container,
            _ref$relation = _ref.relation,
            relation = _ref$relation === undefined ? new _vanexRelation2.default() : _ref$relation;

        started = true;

        // 保证context只实例化一次
        if (context) {
            addModel(models);
        } else {
            context = new _vanexContext2.default(models, {
                middleware: _vanexMiddleware2.default,
                relation: relation,
                plugin: globalPlugin
            });
        }

        // 否则返回可执行组件

        var VanexComponent = function (_Component) {
            _inherits(VanexComponent, _Component);

            function VanexComponent(props, context) {
                _classCallCheck(this, VanexComponent);

                return _possibleConstructorReturn(this, _Component.call(this, props, context));
            }

            VanexComponent.prototype.render = function render() {
                var data = globalPlugin.apply('beforeConnectStore')(context.data) || context.data;

                return _index2.default.createElement(
                    _index5.Provider,
                    data,
                    _index2.default.createElement(ContainerComponent, _extends({ ref: '_conatinerComponent' }, this.props))
                );
            };

            _createClass(VanexComponent, [{
                key: 'mobxStores',
                get: function get() {
                    return this.refs['_conatinerComponent'].context.mobxStores;
                }
            }]);

            return VanexComponent;
        }(_index.Component);

        var containerEl = container;

        if (containerEl) {
            // 如果传递了容器(选择器)，则执行渲染
            if (typeof container === 'string') {
                containerEl = document.querySelector(container);
            }

            (0, _index6.render)(_index2.default.createElement(VanexComponent, null), containerEl);
        } else {
            return VanexComponent;
        }
    };

    // 初始化后再添加model
    function addModel(models, callback) {
        // 必须先执行初始化
        if (!started) {
            throw new Error('[vanex]: Init your app first!');
        }

        // 将models添加进context
        context.addModel(models);
    }

    function use(plugin) {
        var _plugin$onEffect = plugin.onEffect,
            onEffect = _plugin$onEffect === undefined ? [] : _plugin$onEffect,
            restPlugin = _objectWithoutProperties(plugin, ['onEffect']);

        // 异步请求中间件
        onEffect.forEach(function (item) {
            return _vanexMiddleware2.default.use(item);
        });

        // 插件机制
        globalPlugin.use(restPlugin);
    }
});
__def('@alife/vanex/0.x/src/extend-model', ['require', 'module', 'exports', '@alife/vanex/0.x/src/create-model', '@alife/vanex/0.x/src/utils'], function (require, module, exports, _createModel, _utils) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = extendModel;

    var _createModel2 = _interopRequireDefault(_createModel);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function extendModel(parentModel) {
        var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!configs.name) {
            throw new Error('[extendModel] need a name.');
        }

        if ((0, _utils.isObject)(parentModel)) {
            parentModel = (0, _createModel2.default)(parentModel);
        }

        return (0, _createModel2.default)(configs, parentModel);
    }
    module.exports = exports['default'];
});
__def('@alife/vanex/0.x/src/index', ['require', 'module', 'exports', 'mobx/3.x/index', 'mobx-react/4.x/index', '@alife/vanex/0.x/src/start', '@alife/vanex/0.x/src/vanex-relation', '@alife/vanex/0.x/src/create-model', '@alife/vanex/0.x/src/extend-model'], function (require, module, exports, _index, _index2, _start, _vanexRelation, _createModel, _extendModel) {
    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var mobx = _interopRequireWildcard(_index);

    var mobxReact = _interopRequireWildcard(_index2);

    var _start2 = _interopRequireDefault(_start);

    var _vanexRelation2 = _interopRequireDefault(_vanexRelation);

    var _createModel2 = _interopRequireDefault(_createModel);

    var _extendModel2 = _interopRequireDefault(_extendModel);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _interopRequireWildcard(obj) {
        if (obj && obj.__esModule) {
            return obj;
        } else {
            var newObj = {};

            if (obj != null) {
                for (var key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
                }
            }

            newObj.default = obj;
            return newObj;
        }
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    exports.default = _extends({}, mobx, mobxReact, {
        createModel: _createModel2.default,
        extendModel: _extendModel2.default,
        start: _start2.default,
        Relation: _vanexRelation2.default,
        addModel: _start.addModel,
        use: _start.use
    });
    module.exports = exports['default'];
});
//# sourceMappingURL=./index.js.map