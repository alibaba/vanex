const userDB = [{
    username: 'Lili',
    from: 'USA',
    habits: ['Swim'],
    password: '123',
    id: '1'
}, {
    username: 'Jack',
    from: 'Chinese',
    habits: ['football'],
    password: '123',
    id: '2'
}, ];

const todosDB = [{
    userId: '2',
    text: 'Jack todo 1',
    id: 'i1',
    completed: false
}, {
    userId: '2',
    text: 'Jack todo 2',
    id: 'i2',
    completed: false
}, ];

export function login(username, password) {
    return new Promise(res => {
        setTimeout(() => {
            const result = userDB.find(user => user.username.toLowerCase() === username.toLowerCase() && user.password === password);

            if (result) {
                res({
                    success: true,
                    id: result.id
                });
            } else {
                res({
                    success: false,
                    message: 'login error'
                });
            }
        }, 1000);
    });
}

export function fetchUserInfo(id) {
    return userDB.find(user => user.id === id);
}

export function getTodosByUserId(userId) {
    return todosDB.filter(item => item.userId === userId);
}
