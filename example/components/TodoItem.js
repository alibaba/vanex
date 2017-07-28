import React, {
    Component,
    PropTypes
} from 'react';
import {
    observer
} from '../../lib';
import TodoItemModel from '../models/TodoItem';

@observer
export default class TodoItem extends Component {
    static propTypes = {
        todo: PropTypes.instanceOf(TodoItemModel).isRequired,
    }

    render() {
        const {
            completed,
            text
        } = this.props.todo;
        return (
            <li>
                <label>
                    <input type="checkbox" checked={completed} onChange={this.props.todo::this.props.todo.toggleComplete}/>
                    {text}
                </label>
            </li>
        );
    }
}
