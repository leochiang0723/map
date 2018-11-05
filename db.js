var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'test',
    port: 3306
});

connection.connect(function(err) {
    if (err) throw err;
    connection.query('select * from city_info', function(err, result) {
        if (err) console.log(err);
        console.log("DB is now connected!")
    })

});



// Other way to connect DB
// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The solution is: ', rows[0].solution);
// });

// connection.end();

module.exports = connection;