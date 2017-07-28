import App from './App';
import React from 'react';
// load middlewares
import middlewares from './middlewares';
// relation
import relation from './relations';
import { render } from 'react-dom';
import {
    start,
} from '../lib';
import todos from './models/Todos';
// model
import user from './models/User';

// 直接渲染
start({
    component: App,
    models: {
        user,
        todos
    },
    middlewares,
    relation,
    container: '#root'
});
