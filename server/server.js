const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {mongoose} = require ('./db/mongoose');
const {Alumni} = require ('./models/alumni');

const publicPath = path.join(__dirname, '../public');
const port = 3000;
console.log(publicPath);
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) =>{
    console.log('Connected to host');
    var alumni = new Alumni({
        first_name: "Stav",
        last_name: "Hadas",
        phone:"+972549213941",
        email:"4stav.h@gmail.com",
        subjects:[{
            key: 1,
            name: "מכאניקה"
        },{
            key: 2,
            name: "תכנות"
        }]
    });
    alumni.save().then(()=>{
        console.log("Alumni Inserted");
    }).catch((e)=>{
        console.log(`Problem Inserting Alumni ${e}`);
    });
});
server.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});