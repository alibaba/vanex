
export default {
    name: 'TodoItem',
    data: {
        text: '',
        userId: null,
        completed: false,
        id: null,
    },
    init(initData) {
        this.set({
            ...initData,
        });
    },
    syncs: {
        update(text, userId, completed) {
            this.set({
                text,
                userId,
                completed,
            });
        },

        toggleComplete() {
            this.completed = !this.completed;
        },
    },
};
