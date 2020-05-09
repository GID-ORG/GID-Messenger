var fs = require('fs');
var net = require('net');
var colors = require('colors');


var config = JSON.parse(fs.readFileSync('./config.json'));


var client = new net.Socket();

client.connect(config.port,config.host,() => {
    console.log("connected.".green);
    client.write(`${config.username},succ`);
    console.log("\n");
})

client.on('error',(err) => {
    if(err == "Error: read ECONNRESET") {
        console.log("Server disconnected".red);
    } else {
        console.log(`${err}`.red);
    }
})

client.on('data',(data) => {
    console.log('\n' + data.toString());
})