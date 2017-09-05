# vanex

基于`mobx & mobx-react`的React store管理框架，提供简单快捷的开发范式。使用模式类似dva，但用起来比dva更简单，开发效率更高！  

文档地址：https://alibaba.github.io/vanex/

example地址: https://github.com/alibaba/vanex/tree/master/example

## 特点

`三个API`搞定问题！简单易上手，开发效率高。

## 如何使用

> vanex提供了一键初始化的`start`方法，入口文件可以像下面这样开始：

```js
import React from 'react';
import App from './App';

import {
    start,
} from 'vanex';

// model
import user from './models/User';
import todos from './models/Todos';

start({
    component: App,
    container: '#root',
    models: {
        user,
        todos
    }
});
```

所以，只需要把你的model（类似于tarot的module）、React Container Component、Middleware（可选）、Relation传递进来，应用就能跑起来了。

介绍下几个概念：  

- `model`： 数据管理，区别于tarot，其只有：name命名空间以及data、action两个核心部分，action部分可以同时存放类似于Reducers以及Effects两个部分的操作（作为优化，后续这里可以做拆分）；

- `middleware`：中间件，用于辅助异步处理。model重定义的一个action最终被执行的流程是这样的：首先其会被mobx的action函数包一层，以避免掉每次更改数据都会触发一次UI的重新渲染，然后其会被各个中间件依次执行，而每个中间件都有before/after/error三个操作，可以在不同的操作中对每一种操作做统一的处理；

- `relation`：用于不同model之间的通信，基于监听订阅模式。

> 基于vanex的开发范式的`container Component`也是UI Component，UI Component像下面这样：

```js
import React, {Component, PropTypes} from 'react';

// components
import UserLogin from './components/UserLogin';
import UserDetail from './components/UserDetail';
import Todos from './components/Todos';

import {
    inject,
    observer,
} from 'vanex';

// 注意先observer，后inject
@inject('user')
@observer
export default class App extends Component {
    render() {
        // const user = this.props.user.toJSON();
        console.log(this.props.user.toJSON());
        const {user} = this.props;

        console.log('user.isLogin:', user.isLogin);

        if (user.isLogin !== true) {
            return <UserLogin />;
        }

        return (
            <div>
                <UserDetail />
                <Todos />
            </div>
        );
    }
}
```

这里的`oberser`来自于mobx的observer，`inject`则来自于mobx-react。如果想给一个Component同时注入多个model，则可以像下面这样：  

```js
// start
import React from 'react';
import App from './App';

import {
    start,
} from 'vanex';

// model
import user from './models/User';
import todos from './models/Todos';

start({
    component: App,
    container: '#root',
    models: {
        user,
        todos
    }
});
```

```js
import {
    inject,
    observer,
} from 'vanex';

@inject(
    stores => ({
        user: stores.user,
        todos: stores.todos,
    })
)
@oberser
class MyComponent extends Component{
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {
            user,
            todos,
        } = this.props;

        return (
            <div>{user.name}</div>
        );
    }
}
```

mobx的observer API，用于将React Component变成observable的（动态收集依赖），在对model中的某些数据做了操作之后，如果被修改的数据刚好被该React组件使用到了，就会触发该组件的重新渲染，这也就是mobx能细粒度控制数据的原因所在。  

mobx-react的inject API，用于指定将哪些model注入进React Component(this.props.modelName)，也就指定了该组件基于哪些数据做Observeable。

## model

代码类似于下面这样：

```js
import TodoItem from './TodoItem';
import * as api from '../api';

export default {
    name: 'Todos',
    data: {
        list: [],
    },
    syncs: {
        add(text, userId) {
            // 类似于Vue，对数组的操作会触发UI的重新渲染
            this.list.push(new TodoItem({
                text,
                userId
            }));
        },
    },
    effects: {
        async getByUserId(userId) {
            let todos = await api.getTodosByUserId(userId);
            todos = todos.map(todo => new TodoItem(todo));
            // 类似于Vue，对数组的操作会触发UI的重新渲染
            this.list = this.list.concat(todos);
        },
    }
};
```

model由以下几个部分组成：

- 1、name: 当前model的命名空间；
- 2、constants: 不可变常量；
- 3、data: 可操作数据部分；
- 4、syncs: 同步操作数据部分；
- 5、effects: 异步处理部分；
- 6、init: 初始化model后的回调方法；
- 7、autorun: 每次对数据进行操作后都会自动执行的方法。

## 触发action

### model内部触发

model内部定义的Data数据，会被赋值到model实例上，所以任何在Data中定义的数据都可以通过this.xxx的方式来引用，如下：

```js

import fetch from 'whatwg-fetch';

const pageSize = 20;

export default {
    name: 'Applications',

    data: {
        dataSource: [

        ], // 列表显示的数据

        detailPageVisible: false,

        campaignDetail: {},
    },

    syncs: {
        validate(value) {
            value = value ||'';

            // xxxx

            return {
                code: 200
            };
        },
    },

    effects:{
        async getList(payload = {}) {
            const {
                currentPage = 1,
            } = payload;

            const url = `/applications/list/${currentPage}?pageSize=${pageSize}`;

            let res = await fetch(url);

            res = res.body;

            const validateRes = this.validate(res);

            if(validateRes.code == 200) {
              this.dataSource = res.data; // 这样就会触发对应Component的重新渲染
              this.currentPage = res.currentPage;
              this.totalItem = res.totalItem;
              this.totalPage = res.totalPage;
            }

            return res;
        },
    }
};
```
可以看到，更改数据则是直接给model实例赋值即可，简单直接高效，而且多次赋值只会触发一次的重新渲染。你能想象如果一个页面是一个list列表，用户对列表中某一个进行操作后，需要修改这一项的数据及显示，只需要执行类似于：

```js
this.props.home.list[2].name = 'New Name';
```

的代码就能完成name的数据处理及页面展示更改吗？想想就激动是不是。  

有的同学会有：`syncs和effects里面多次对model直接赋值会触发UI的多次渲染`的担心，其实不会的，我们队syncs以及effects里面的每一个方法都用会使用mobx的`action`做了一层包装，从而来避免这个问题。  

另外，我们也提供`this.set()`的辅助方法来方便的为model改值，所以你还可以这样做：

```js
this.set({
  dataSource: res.data,
  currentPage: res.currentPage,
  totalItem: res.totalItem,
  totalPage: res.totalPage,
});
```
这里会使用mobx的`runInAction`来统一执行，从而保证UI渲染只执行一次。

### 组件内触发

如下，简单直接：
```js
import { inject, observer } from 'vanex';

@inject('applications')
@observer
class Applications extends Component {
    constructor(props, context) {
        super(props, context);
    }

    clickHandler() {
      this.props.applications.getList(); // 直接执行
    }

    render() {
      return (
        <div onClick={::this.clickHandler}></div>
      );
    }
}
```

## Vanex插件机制

Vanex支持`插件`机制，使用的方式如下：
```js
import { start, use } from 'vanex';

import effectPlugin from './effect-plugin';

use(effectPlugin);

// start代码
```

目前已经提供的插件列表如下：

### onStateChange

用于监听数据发生改变的时候的触发回调。格式如下：
```js
export default {
    onStateChange: [event => {
        console.log(event);
    }]
};
```

### onEffect

用于处理`异步执行`执行`前(before)、后(after)、错误(error)`以及过滤哪些effects执行该回调，它在执行的时候其实是以中间件的形式来执行的。如果有类似于`每次请求都自带csrfToken`的需求，则可以在`before`钩子函数中组装。  

具体使用如下：

```js
// Before exec action
function preLogger({
    type,
    payload
}) {
    console.log(`[${type}] params: `, payload);

    payload。csrfToken = 'xxx'; // 这里的更改会对请求参数生效

    return payload;
}

// Action exec fail
function errorLogger({
    type,
    payload
}) {
    console.log(`[${type}] error: `, payload.message);
    return payload;
}

// After exec action
function afterLogger({
    type,
    payload
}) {
    console.log(`[${type}] result: `, payload);
    return payload;
}

export default {
    filter({
            type
        }) {
        return /^User/.test(type); // 只针对Model名字是User的进行下面钩子函数的执行
    },
    before: preLogger,
    after: afterLogger,
    error: errorLogger,
};
```

### onAction

用于在执行`syncs` Action之后触发。格式如下：

```js
export default {
    onAction: [(
        actionName,
        actionArgs,
        result) => {
            console.log(`当前执行Action的名字：${actionName}`);
            console.log(`当前执行Action的参数：${actionArgs}`);
            console.log(`当前执行Action的结果：${result}`);
        }]
};

```

### getActionState

这个并不是Vanex插件，但是用于解决在组件中获取`当前model中某个effect是否正在发送请求`的问题，而这个状态可以用于`方便的控制Loading组件是否可见`。因为这种需求非常普遍，所以Vanex直接内置到内部实现中。使用示例如下：

```js
const {
    user
} = this.props;

const {
    loading: loginLoading,
    error: loginError
} = user.getActionState('user/login');
```

## 用于开发组件

有时候，我们并不想执行页面渲染，而是用Vanex来开发一个组件，这时，还是可以使用`start` API，只要不传如`container`值，就会返回一个React Component。

```js
import React from 'react';
import { render } from 'react-dom';
import App from './App';

// load middlewares
import middlewares from './middlewares';

import {
    start,
    use,
} from 'vanex';

use({
    onEffect: middlewares
});

// model
import user from './models/User';
import todos from './models/Todos';

// relation
import relation from './relations';

// 验证start返回一个组件
const MyComponent = start({
    component: App,
    models: {
        user,
        todos
    },
    relation
});

render(<MyComponent data={{a: 1}} />, document.querySelector('#root'));

```


## 特点

- 简单易上手，开发效率高；
- MVVM：Vanex实现了基于React的MVVM开发范式，简单直接，开发效率高；
- 更改store数据：直接赋值；
- 触发action：直接执行store的action；
- 性能优化：自动做掉。

## 为什么基于mobx的开发范式更简单高效？

Mobx的实现思想和Vue几乎一样，所以其优点跟Vue也差不多：通过监听数据（对象、数组）的属性变化，可以通过直接在数据上更改就能触发UI的渲染，从而做到MVVM、响应式、上手成本低、开发效率高，在数据管理上需要再详细阐述下其区别。

Redux是建议全局唯一Store的，多个Reducers也会在传递给react-redux之前被合并成一个root reducer，任何数据的更改（通过Reducer）都会通过这一个store来触发整个UI树的重新渲染，如果不做任何的性能优化（pureRender等），就算VD(Virtual Dom)有了再高的效率提升，当页面数据量、DOM数量大了，性能消耗也是非常大的。另外一点，Redux实现的对数据的管理是pull方式的，就是说其只能等待应用派发某个行为（Action），然后重新触发UI的渲染，而做不到对行为的可预期；Mobx则不一样，他是基于监听数据的属性变化来实现的，而且是多store的，对于任何的数据变更都是第一时间知道的，所以其实现方式是基于push的监听订阅模式而实现，这样，他就可以做到对数据的可预测以及细粒度的控制，甚至可以通过修改React组件生命周期的方式来减少性能的消耗，而无需使用者对这些细节关心。当然这一切肯定是有了mobx对组件做observe操作才能实现的，所以也就有了observer用的越多，应用性能越高的说法。

## 感谢

Vanex的部分实现参考自MVVM框架：[mobx-roof](https://github.com/mobx-roof/mobx-roof)。

## 落地

- 1、[内容创作投放平台](https://kol.alibaba.com)
