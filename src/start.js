/**
 * Tips：
 * 如果start没有配置container选项，则返回一个可渲染的组件；
 * 如果传递了container，则执行渲染。
 * */

import React, { Component } from 'react';

import {Provider} from 'mobx-react';
import VanexContext from './vanex-context';
import VanexRelation from './vanex-relation';
import middleware from './vanex-middleware';
import {render} from 'react-dom';

var context;
var ContainerComponent;
var componentIns;
var started = false;

export default({
    component,
    models,
    container,
    middlewares = [],
    relation = new VanexRelation
}) => {
    started = true;
    
    ContainerComponent = component;
        
    if(!Array.isArray(middlewares)) {
        middlewares = [middlewares];
    }

    middlewares.forEach(item => {
        middleware.use(item);
    });

    context = new VanexContext(models, {
        middleware,
        relation,
    });

    // 否则返回可执行组件
    class VanexComponent extends Component {
        constructor(props, context) {
            super(props, context);

            componentIns = this;
        }

        render() {
            return (
                <Provider ref="provider" {...context.data}>
                    <ContainerComponent {...this.props.data} />
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

    // 将context的data传递给ContainerComponent及其子组件
    // 目前是通过执行重新渲染的机制实现，考虑优化
    componentIns.forceUpdate(callback);
}
