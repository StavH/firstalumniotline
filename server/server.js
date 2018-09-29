const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {mongoose} = require ('./db/mongoose');
const {Alumni} = require ('./models/alumni');
const {Subject} = require('./models/subject');

const publicPath = path.join(__dirname, '../public');
const port = 3000;
console.log(publicPath);
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) =>{
    console.log('Connected to host');
    socket.on("getAllSubjects",(callback)=>{
       Subject.find({},(err,subjects)=>{
        callback(subjects);
       });
         
    });
});
server.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
});