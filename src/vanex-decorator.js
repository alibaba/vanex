import {
    inject,
    observer,
} from 'mobx-react';

import {
    autorun,
} from 'mobx';

function wrapComponentClass(injectModels, autoruns, componentClass) {
    if (autoruns) {
        // 如果指定了 autorun 的方法
        // 则劫持原组件的声明周期，componentWillMount/componentWillUnmount 用于注册和取消 autorun
        const originWillMount = componentClass.prototype.componentWillMount;
        const originWillUnmount = componentClass.prototype.componentWillUnmount;
        const cancels = [];
        componentClass.prototype.componentWillMount = function() {
            autoruns.forEach(funcname => cancels.push(autorun(this[funcname].bind(this))));
            originWillMount && originWillMount.call(this);
        };
        componentClass.prototype.componentWillUnmount = function() {
            originWillUnmount && originWillUnmount.call(this);
            cancels.forEach(cancel => cancel());
        };
    }

    // 劫持组件的构造函数把注入到 props 中的 model 塞到 this 中
    // 推荐使用 this.modelxxx 来访问 model，避免整个 props 被依赖收集
    // 纯函数组件不需要做这个工作
    if (componentClass.prototype && componentClass.prototype.render) {
        // 非纯函数组件肯定会在原型链上有 render
        const originComponetClass = componentClass;
        function newComponentClass(props) {
            const comp = new originComponetClass(...arguments);
            injectModels.forEach(model => comp[model] = props[model]); 
            return comp;
        }
        newComponentClass.prototype = originComponetClass.prototype;
        componentClass = newComponentClass;
    }

    // 简化原有的 @inject()@observer 组合
    componentClass = inject(stores => {
        const result = {};
        injectModels.forEach(name => result[name] = stores[name]);
        return result;
    })(observer(componentClass))

    return componentClass;
}

// 为了让 API 看起来更简洁
// 支持 
// @vanex('modelx', 'modely')('autoRunMethodx', 'methody')
// class Componnet {}
// 和
// @vanex('modelx')
// class Component {}
// 对于纯函数组件
// const Comp = {
//    @vanex('modelx')
//    Comp() {
// 
//    }   
// }
const vanex = (...injectModels) => (...autorunOrComponentClass) => {
    const firstType = typeof autorunOrComponentClass[0];
    if (firstType === 'function') {
        // 第二个参数就是组件了
        return wrapComponentClass(injectModels, null, autorunOrComponentClass[0]);
    } else if (firstType === 'object') {
        // 对方法使用了注解，纯函数组件
        const pureComponent = Object.values(autorunOrComponentClass[0])[0];
        return wrapComponentClass(injectModels, null, pureComponent);
    } else if (firstType === 'string' || firstType === 'array') {
        // 第二个参数是 autorun，返回函数继续接受第三个参数
        return componentClass => wrapComponentClass(injectModels, autorunOrComponentClass, componentClass);
    }
};

export default vanex;
