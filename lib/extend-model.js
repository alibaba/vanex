'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = extendModel;

var _createModel = require('./create-model');

var _createModel2 = _interopRequireDefault(_createModel);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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