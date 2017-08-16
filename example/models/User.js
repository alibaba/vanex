import * as api from '../api';
const STORE_KEY = 'vanex';

export default {
    name: 'User',
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
        counts: 0,
        user: {
            name: ''
        }
    },

    init() {
        // InitData from localStorage
        let data = localStorage.getItem(STORE_KEY);
        data = data ? JSON.parse(data) : {};
        // constants ignore
        delete data.type;
        this.set({
            ...data,
        });
    },

    // 一些副作用的函数操作
    syncs: {
        logout() {
            this.set({
                isLogin: false,
                username: null,
                password: null,
                userId: null,
            });
        },
    },

    effects: {
        async login(username, password) {
            const res = await api.login(username, password);

            if (res.success) {
                const obj = {
                    userId: res.id,
                    isLogin: true,
                    loginError: null,
                    username,
                    password,
                    'user.name': username
                };

                this.set(obj);
            } else {
                this.loginError = res.message;
            }

            return res;
        },
        async fetchUserInfo() {
            const res = await api.fetchUserInfo(this.userId);
            this.set({
                from: res.from,
                habits: res.habits,
            });

            return res;
        },
    },

    autorun: {
        // this.toJS can listen all data changed
        saveToLocalStorage() {
            localStorage.setItem(STORE_KEY, JSON.stringify(this.toJS()));
        },
    },
};
