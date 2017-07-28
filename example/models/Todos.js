import TodoItem from './TodoItem';
import * as api from '../api';

export default {
    name: 'Todos',
    data: {
        list: [],
    },
    syncs: {
        add(text, userId) {
            this.list.push(new TodoItem({
                text,
                userId
            }));
        },
    },
    effects: {
        async getByUserId(userId) {
            let todos = await api.getTodosByUserId(userId);
            todos = todos.map(todo => new TodoItem(todo));
            this.list = this.list.concat(todos);
        },
    }
};
