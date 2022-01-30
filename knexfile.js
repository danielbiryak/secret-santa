module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './secret_santa.db3'
        },
        useNullAsDefault: true
    }
};
