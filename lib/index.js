'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _mobx = require('mobx');

var mobx = _interopRequireWildcard(_mobx);

var _mobxReact = require('mobx-react');

var mobxReact = _interopRequireWildcard(_mobxReact);

var _start = require('./start');

var _start2 = _interopRequireDefault(_start);

var _vanexRelation = require('./vanex-relation');

var _vanexRelation2 = _interopRequireDefault(_vanexRelation);

var _createModel = require('./create-model');

var _createModel2 = _interopRequireDefault(_createModel);

var _extendModel = require('./extend-model');

var _extendModel2 = _interopRequireDefault(_extendModel);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
*/

exports.default = (0, _extends3.default)({}, mobx, mobxReact, {
    createModel: _createModel2.default,
    extendModel: _extendModel2.default,
    start: _start2.default,
    Relation: _vanexRelation2.default,
    addModel: _start.addModel,
    use: _start.use
});
module.exports = exports['default'];