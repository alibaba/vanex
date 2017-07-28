import * as api from '../api';
const STORE_KEY = 'vanex';

export default {
    name: 'New',

    constants: {
        // read only
        type: 'USER',
    },

    // 数据部分
    data: {
        isLogin: false,
        password: null,
        username: null,
        userId: null,
        loginError: '',
        habits: [],
        from: null,
    },

    init() {
        
    },

    // 一些副作用的函数操作
    syncs: {
        try() {
            alert(1);
        },
    },

    effects: {
        
    },
};
