'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = createModel;

var _vanexModel = require('./vanex-model');

var _vanexModel2 = _interopRequireDefault(_vanexModel);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
*/

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
        others = (0, _objectWithoutProperties3.default)(_ref, ['name', 'data', 'constants', 'privates', 'autorun', 'syncs', 'effects']);

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

        (0, _assign2.default)(this, mobxSyncs, mobxAsyncs);

        // Object.getPrototypeOf(MobxModel)指向_MobxModel的构造函数
        var res = (0, _utils.possibleConstructorReturn)(this, (0, _getPrototypeOf2.default)(MobxModel).call(this, (0, _extends3.default)({}, data, _initData), middleware, plugin, (0, _extends3.default)({}, autorun, _autorun), (0, _extends3.default)({}, constants, _constants)));

        return res;
    }

    MobxModel.uuid = ++uuid;
    MobxModel.syncs = syncs;
    MobxModel.effects = effects;
    MobxModel.autorun = autorun;

    (0, _utils.inherits)(MobxModel, Parent);

    // Define MobxModel name
    (0, _defineProperties2.default)(MobxModel, {
        name: {
            enumerable: false,
            configurable: true,
            writable: false,
            value: (0, _utils.nameToUpperCase)(name)
        }
    });

    MobxModel.prototype = (0, _assign2.default)(MobxModel.prototype, others, privates);

    return MobxModel;
}
module.exports = exports['default'];