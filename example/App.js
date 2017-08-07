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
        const click = () => {
            user.counts = user.counts + 1;
            console.log(user.counts)
        }
        if (user.isLogin !== true) {
            return <div>
                <UserLogin />
                <button type="button" style={{'font-size': '300px'}} onClick={click}>{user.counts}</button>
            </div>;

        }

        return (
            <div>
                <UserDetail />
                <Todos />
                <button type="button" style={{'font-size': '300px'}} onClick={click}>{user.counts}</button>
            </div>
        );
    }

    shouldComponentUpdate(nextProps) {
        console.log('nextProps:', nextProps);

        return false;
    }
}
