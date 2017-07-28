import {
    Relation
} from '../../lib';

const relation = new Relation({
    filters: {
        filter1(payload) {
            return payload;
        },
        filter2(payload) {
            return payload;
        },
    },
});

relation.init(context => {
    const {
        user,
        todos
    } = context;

    if (user.isLogin) {
        user.fetchUserInfo();
        todos.getByUserId(user.userId);
    }
});

relation.listen('user.login', ({
    context,
    payload
}) => {
    console.log('[relation] user.login: ', payload, context);

    const {
        user
    } = context;

    if (user.isLogin) {
        user.fetchUserInfo();
    }
});

relation.listen(/^user/, ({
    action
}) => {
    console.log('[relation] user action name: ', action);
});

relation.listen('user.login; user.fetchUserInfo', ({
    action
}) => {
    console.log(action);
});

relation.listen(`
  ## comment
  user.login | filter1 => filter2 | todos.getByUserId
`);

relation.autorun((context) => {
    console.log('[autorun] ', context.user.toJS());
    console.log('[autorun] ', context.todos.toJS());
});

export default relation;
