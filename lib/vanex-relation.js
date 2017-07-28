'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _utils = require('./utils');

var _mobx = require('mobx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    if ((typeof filters === 'undefined' ? 'undefined' : (0, _typeof3.default)(filters)) === 'object') {
        (0, _keys2.default)(filters).forEach(function (key) {
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
        (0, _classCallCheck3.default)(this, MobxRelation);

        this._relations = [];
        this._filters = {};
        this._inits = [];
        this._autoruns = [];
        this.addFilters(opts.filters);
    }

    (0, _createClass3.default)(MobxRelation, [{
        key: 'addFilters',
        value: function addFilters() {
            var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            checkFilters(filters);
            this._filters = (0, _extends3.default)({}, this._filters, filters);
        }
    }, {
        key: 'init',
        value: function init(initFn) {
            if (typeof initFn === 'function') {
                this._inits.push(initFn);
            } else {
                throw new Error('[MobxRelation] Relation init need a function but get ' + (typeof initFn === 'undefined' ? 'undefined' : (0, _typeof3.default)(initFn)) + '.');
            }
        }
    }, {
        key: 'use',
        value: function use() {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            args.forEach(function (fn) {
                if (typeof fn === 'function') {
                    fn(_this);
                } else {
                    throw new Error('[MobxRelation] relation.use need functions but get ' + (typeof fn === 'undefined' ? 'undefined' : (0, _typeof3.default)(fn)) + '.');
                }
            });
        }
    }, {
        key: 'autorun',
        value: function autorun(_autorun) {
            if (typeof _autorun === 'function') {
                this._autoruns.push(_autorun);
            } else {
                throw new Error('[MobxRelation] Relation autorun need a function.');
            }
        }
    }, {
        key: 'triggerAutorun',
        value: function triggerAutorun(context) {
            this._autoruns.forEach(function (fn) {
                (0, _mobx.autorun)(fn.bind(null, context.data));
            });
        }
    }, {
        key: 'triggerInit',
        value: function triggerInit(context) {
            this._inits.forEach(function (fn) {
                return fn(context.data);
            });
        }
    }, {
        key: 'listen',
        value: function listen(patterns, fn, errorFn) {
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
        }
    }, {
        key: 'execInMiddleware',
        value: function execInMiddleware(_ref) {
            var _this3 = this;

            var fullname = _ref.fullname,
                payload = _ref.payload,
                context = _ref.context;

            context = (0, _extends3.default)({}, context.data);
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
                                    _key$split2 = (0, _slicedToArray3.default)(_key$split, 2),
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
        }
    }, {
        key: 'parsePattern',
        value: function parsePattern(pattern) {
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
        }
    }, {
        key: '_addRelation',
        value: function _addRelation(pattern, fn, errorFn) {
            pattern = this.parsePattern(pattern);
            this._relations.push({
                pattern: pattern,
                fn: fn || emptyFn,
                errorFn: errorFn || function (_ref3) {
                    var payload = _ref3.payload;

                    throw payload;
                }
            });
        }
    }]);
    return MobxRelation;
}();

exports.default = MobxRelation;
module.exports = exports['default'];