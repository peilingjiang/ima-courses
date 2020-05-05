let port = process.env.PORT || 8000;

let express = require('express');
let app = express();

// Make a web application server
let server = require('http').createServer(app).listen(port, function () {
    console.log('Server listening at port: ', port);
});

/* 'tune' / 'embed' / 'matrix' */
app.use(express.static('matrix'));
