/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
*/

import * as mobx from 'mobx';
import * as mobxReact from 'mobx-react';

import start, { addModel, use } from './start';

import Relation from './vanex-relation';
import createModel from './create-model';
import extendModel from './extend-model';

export default {
    ...mobx,
    ...mobxReact,
    createModel,
    extendModel,
    start,
    Relation,
    addModel,
    use,
};
