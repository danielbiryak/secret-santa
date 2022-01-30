module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './data/secret_santa.db3'
        },
        useNullAsDefault: true
    }
};
