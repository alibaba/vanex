import _MobxModel, {
    isMobxModelClass,
    toMobxAsyncActions,
    toMobxSyncActions,
} from './vanex-model';
import {
    classCallCheck,
    inherits,
    nameToUpperCase,
    possibleConstructorReturn
} from './utils';

let uuid = 0;

export default function createModel({
    name,
    data = {},
    constants = {},
    privates = {},
    autorun = {},
    syncs = {}, // 同步处理数据
    effects = {}, // 异步处理数据
    ...others,
}, Parent = _MobxModel) {
    const mobxSyncs = toMobxSyncActions(syncs);
    const mobxAsyncs = toMobxAsyncActions(effects);

    if (!isMobxModelClass(Parent)) {
        throw new Error('[createModel] Parent class must extend From MobxModel.');
    }
    if (!name) {
        throw new Error('[createModel] need a name.');
    }

    function MobxModel(_initData = {}, middleware, _autorun, _constants) {
        classCallCheck(this, MobxModel);

        if (typeof data === 'function') {
            throw new Error('[createModel] `data` can not be a function, please use `init` instead.');
        }

        // Object.getPrototypeOf(MobxModel)指向_MobxModel的构造函数
        const res = possibleConstructorReturn(
            this,
            Object.getPrototypeOf(MobxModel).call(
                this,
                {
                    ...data,
                    ..._initData
                },
                middleware,
                {
                    ...autorun,
                    ..._autorun
                },
                {
                    ...constants,
                    ..._constants
                }
            )
        );

        return res;
    }
    MobxModel.uuid = ++uuid;
    MobxModel.syncs = syncs;
    MobxModel.effects = effects;
    MobxModel.autorun = autorun;
    inherits(MobxModel, Parent);

    // Define MobxModel name
    Object.defineProperties(MobxModel, {
        name: {
            enumerable: false,
            configurable: true,
            writable: false,
            value: nameToUpperCase(name),
        },
    });

    MobxModel.prototype = Object.assign(MobxModel.prototype, others, privates, mobxSyncs, mobxAsyncs);

    return MobxModel;
}
