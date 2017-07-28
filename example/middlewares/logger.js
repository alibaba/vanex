// Before exec action
function preLogger({
    type,
    payload
}) {
    console.log(`[${type}] params: `, payload.join(', '));
    return payload;
}

// Action exec fail
function errorLogger({
    type,
    payload
}) {
    console.log(`[${type}] error: `, payload.message);
    return payload;
}

// After exec action
function afterLogger({
    type,
    payload
}) {
    console.log(`[${type}] result: `, payload);
    return payload;
}

export default {
    filter({
            type
        }) {
        return /^User/.test(type); // 只针对Model名字是User的进行钩子函数的执行
    },
    before: preLogger,
    after: afterLogger,
    error: errorLogger,
};
