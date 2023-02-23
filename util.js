module.exports = {
    responseError: (msg) => {
        return { content: msg, ephemeral: true };
    },
    responseInfo: (msg) => {
        return { content: msg };
    },
    clamp: (val, lower, upper) => {
        return Math.min(Math.max(val, lower), upper);
    }
};
