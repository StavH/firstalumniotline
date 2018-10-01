const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');
const {
    mongoose
} = require('./db/mongoose');
const {
    Alumni
} = require('./models/alumni');
const {
    Subject
} = require('./models/subject');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));
app.get('/admin', (req, res) => {
    res.sendFile(publicPath + '/admin.html');
});

io.on('connection', (socket) => {
    socket.on("getAllSubjects", (callback) => {
        Subject.find({}, (err, subjects) => {
            callback(subjects);
        });

    });
    socket.on("getSubjectName",(id,callback)=>{
        Subject.findById(id, function (err, doc){
            callback(err,doc.name);
          });
    });
    socket.on("getAllAlumnis", (callback) => {
        Alumni.find({}, (err, alumnis) => {
            callback(alumnis);
        });
    });
    socket.on("newSubject", (subject, callback) => {
        newsubject = new Subject(JSON.parse(subject));
        newsubject.save().then(() => {
            callback("Subject Was Added");
        }).catch((e) => {
            callback(e);
        });
    });
    socket.on("newAlumni", (alumni, callback) => {
        newAlumni = new Alumni(JSON.parse(alumni));
        newAlumni.save().then(() => {
            callback("Alumni Was Added");
        }).catch((e) => {
            callback(JSON.stringify(e, null, 2));
        });
    });
    socket.on("updateAlumni", (prevAlum, alumni, callback) => {
        Alumni.findOneAndUpdate(prevAlum, alumni, (err, doc) => {
            if (err) {
                callback("Error on updating Alumni");
            } else {
                callback("Alumni updated successfully");
            }
        });
    });
    socket.on("updateSubject", (prevSubject, newSubject, callback) => {
        Subject.findOneAndUpdate({
            name: prevSubject
        }, {
            name: newSubject
        }, (err, doc) => {
            callback(err, prevSubject);
        });
        Alumni.find({},(err,docs)=>{
            docs.forEach(doc=>{
                var subjects = doc.subjects;
                subjects.forEach(subject=>{
                    if(subject.name == prevSubject){
                        subject.name = newSubject;
                    }
                });
                Alumni.findOneAndUpdate({_id:doc.id},{subjects},(err)=>{
                    if(err == null){
                        console.log("SUCCEDDDDD");
                    }
                });
            });
        });
    });
    socket.on("getAlumnisFiltered", (filter, callback) => {
        if (filter.first_name == "") {
            delete filter.first_name;
        }
        if (filter.last_name == "") {
            delete filter.last_name;
        }
        if (filter.subjects.length != 0) {
        }
        var subjects = [];
        subjects = filter.subjects.map(obj => obj.name);
        delete filter.subjects;
        var docSubject = [];
        var result = [];
        alumnis = Alumni.find(filter, (err, docs) => {
            if (subjects.length > 0) {
                result = docs.filter(function (doc) {
                    docSubject = [];
                    doc.subjects.forEach(subject => {
                        docSubject.push(subject.name);
                    }); // get a list of doc Subjects
                    return (_.intersection(docSubject, subjects).length > 0);
                });
            } else {
                result = docs;
                
            }
            callback(result);
        });


    })
});
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});