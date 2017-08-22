/**
 * Copyright (C) 2017-2017 Alibaba Group Holding Limited
*/

/**
 * Tips：
 * 如果start没有配置container选项，则返回一个可渲染的组件；
 * 如果传递了container，则执行渲染。
 * */

import React, { Component } from 'react';

import Plugin from './plugin';
import {Provider} from 'mobx-react';
import VanexContext from './vanex-context';
import VanexRelation from './vanex-relation';
import middleware from './vanex-middleware';
import { render } from 'react-dom';

const globalPlugin = new Plugin();

var context;
var started = false;

export default({
    component: ContainerComponent,
    models,
    container,
    relation = new VanexRelation
}) => {
    started = true;

    // 保证context只实例化一次
    if(context) {
        addModel(models);
    } else {
        context = new VanexContext(models, {
            middleware,
            relation,
            plugin: globalPlugin,
        });
    }

    // 否则返回可执行组件
    class VanexComponent extends Component {
        constructor(props, context) {
            super(props, context);
        }

        get mobxStores() {
            return this.refs['_conatinerComponent'].context.mobxStores;
        }

        render() {
            const data = globalPlugin.apply('beforeConnectStore')(context.data) || context.data;
            let form = globalPlugin.get('form');

            if(typeof form === 'function') {
                form = form(context._data || {});
            }

            return (
                <Provider {...data} {...form}>
                    <ContainerComponent ref='_conatinerComponent' {...this.props} />
                </Provider>
            );
        }
    }


    let containerEl = container;

    if(containerEl) {
        // 如果传递了容器(选择器)，则执行渲染
        if (typeof(container) === 'string') {
            containerEl = document.querySelector(container);
        }

        render(<VanexComponent />, containerEl);
    } else {
        return VanexComponent;
    }
};

// 初始化后再添加model
export function addModel(models, callback) {
    // 必须先执行初始化
    if(!started) {
        throw new Error('[vanex]: Init your app first!');
    }

    // 将models添加进context
    context.addModel(models);
}

export function use(plugin) {
    const {
        onEffect = [],
        ...restPlugin,
    } = plugin;

    // 异步请求中间件
    onEffect.forEach(item => middleware.use(item));

    // 插件机制
    globalPlugin.use(restPlugin);
}
