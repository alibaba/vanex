import React, {Component, PropTypes} from 'react';

// components
import UserLogin from './components/UserLogin';
import UserDetail from './components/UserDetail';
import Todos from './components/Todos';

import {
    inject,
    observer,
} from '../lib';

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
