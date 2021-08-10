const mysql = require('mysql');

// module.exports = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'donorun'
// })

const db = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'donorun'
    }
})

module.exports = db;