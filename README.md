# vanex
[![](https://img.shields.io/npm/dm/vanex.svg)](https://www.npmjs.com/package/vanex)

[![NPM](https://nodei.co/npm/vanex.png)](https://npmjs.org/package/vanex)  

[github](https://github.com/alibaba/vanex)

Vanex 是基于 mobx 的 React 数据流管理框架，旨在借助 mobx 提供的基础能力，帮助用户组织更大规模的 React 项目。

# 文档

[https://alibaba.github.io/vanex/](https://alibaba.github.io/vanex/)

# Quick Start

Vanex 提供两个简洁的 API：@vanex 和 start

```js
import React from 'react';
import { vanex, start } from 'vanex';
import axios from 'axios';

const model = {
    name: 'my',

    // 数据部分
    data: {
        name: 'abc'
    },

    // 异步请求部分
    effects: {
        async getName(arg) {
            try {
                const res = await axios.get(`/user?ID=${arg}`);

                if(res.success && res.data) {
                    // set方法会自动触发UI渲染
                    this.set({
                        name: res.data.name
                    });
                }
            } catch(e) {
                alert(e.message);
            }
        }
    },
};

@vanex('my')
class Comp extends React.Component{
    constructor() {
        super(...arguments);
    }

    componentWillMount() {
        // 异步请求数据
        this.my.getName('test');
    }

    render() {
        const { name } = this.my.toJS();

        return (
            <div>
                {name}
            </div>
        );
    }
}

start({
    component: Comp,
    container: '#root', // 要渲染的父节点，不传start方法会返回一个React组件
    models: {
        my: model,
    }
});
```

See more: [https://alibaba.github.io/vanex/quick-start.html](https://alibaba.github.io/vanex/quick-start.html)

# 说明

- ~~mobx是基于`Object.defineProperties()`(无法监听新增属性)实现的，所以会导致：如果在model的data里没有预先设置某项值，后面对该值做改动的时候就不会触发UI的重新渲染，解决方案：调用React刷新UI的API，手动触发UI更新：`this.foreceUpdate()`；~~
- ES7 decorator语法的编译需要babel插件支持：[babel-plugin-transform-decorators-legacy](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy)；
- mobx会对我们存储的数据做一层包装，以实现对`get/set`的订阅，所以我们在控制台打印某个数据的时候，会打印出被包装了的对象，这时，我们可以调用`toJS()`方法来获取原来未被包装的数据，比如我们想获取名为home的model的account对象: `{name: 'home', data: {account: {id: 1}}}`，则可以执行：`const { account } = this.home.toJS();`或者`const { account } = this.props.home.toJS()`，会正常输出：`{id: 1}`。

# TODO

- [x] 修复`autorun`里执行effects里的方法会导致死循环的问题；