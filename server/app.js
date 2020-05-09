var fs = require('fs');
var net = require('net');
var colors = require('colors');

var config = JSON.parse(fs.readFileSync('./config.json'));


var server = net.createServer((sock) => {
    sock.pipe(sock);
});

var aSocks = [];

server.on('error',(err) => {
    console.log(`${err}`.red);
    console.log("oof")
})

server.on('connection',(sock) => {
    aSocks.push(sock);
    sock.on('error',(err) => {
        if(err == "Error: read ECONNRESET") {
            aSocks.forEach((_sock,_id) => {
                if(_sock == sock) {
                    aSocks.slice(_id);
                    console.log('removed socket ' + _id);
                }
            })
        } else {
            console.log(`${err}`.red);
        }
    })
    sock.on('data',(chunk) => {
        var raw = chunk.toString().split(',');
        var username = raw[0];
        var message = raw[1];

        aSocks.forEach((_sock) => {
            if(!_sock.destroyed) {
                _sock.write(`${username}: ${message}`);
            }
        })
    })
})



server.listen(config.port,'127.0.0.1',() => {
    console.log("Server started.".green);
})