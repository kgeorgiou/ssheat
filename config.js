var config = {
    server: {
        url: process.env.SERVER_URL,
        port: process.env.SERVER_PORT
    },
    cartodb: {
        api_key: process.env.CARTODB_API_KEY,
        account: process.env.CARTODB_ACCOUNT
    }
};

module.exports = config;