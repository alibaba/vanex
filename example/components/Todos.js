import React, {
    Component,
    PropTypes
} from 'react';
import {
    observer,
    inject,
} from '../../lib';

@inject('todos')
@observer
export default class Todos extends Component {
    static propTypes = {
        todos: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div>
                用Vanex封装组件示例
            </div>
        );
    }

    componentDidMount() {
        console.log('add' in this.props.todos);
    }
}
