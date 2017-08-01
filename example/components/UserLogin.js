import React, {
    Component,
    PropTypes
} from 'react';
import {
    addModel,
    inject,
    observer,
    Provider
} from '../../lib';

import newAdded from '../models/newAdded';


// 测试多个model的情形
import {
    start,
    use,
} from '../../lib';

import todos from '../models/Todos';
import TodosCom from './Todos';

const LastTodoCom = start({
    component: TodosCom,
    models: {
        todos,
    },
});

@inject('user')
@observer
export default class UserLogin extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    }

    login() {
        this.props.user.login(this.refs.username.value, this.refs.password.value);
    }

    render() {
        const {
            user
        } = this.props;
        const {
            loading: loginLoading,
            error: loginError
        } = user.getActionState('user/login');

        const errorVal = user.loginError;

        return (
            <div className="container">
                <div>
                    username:<input ref="username" type="text" placeholder="Jack"/>
                    password:<input ref="password" type="password" placeholder="123"/>
                    <button onClick={::this.login}>login</button>
                    {
                        loginLoading
                        ? <span>loading...</span>
                        : <span style={{ color: 'red' }}>{(loginError && loginError.message) || errorVal}</span>
                    }
                </div>

                <LastTodoCom ref='todos' />
            </div>
        );
    }

    componentDidMount() {
        // addModel({
        //     newAdded,
        // });

        console.log('123:', 'add' in this.refs.todos.mobxStores.todos);
    }
}
