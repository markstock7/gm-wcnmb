module.exports = require('knex')({
    client: 'mysql',
    connection: {
        host: '123.57.14.77',
        user: 'root',
        password: 'xiaoming',
        charset: 'utf8',
        database: 'growingio'
    },
    acquireConnectionTimeout: 10000 //指明连接计时器大小，默认为60000ms
});
