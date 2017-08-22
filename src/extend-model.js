/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
*/

import createModel from './create-model';

import {
    isObject,
} from './utils';

export default function extendModel(parentModel, configs = {}) {
    if (!configs.name) {
        throw new Error('[extendModel] need a name.');
    }

    if(isObject(parentModel)) {
        parentModel = createModel(parentModel);
    }

    return createModel(configs, parentModel);
}
