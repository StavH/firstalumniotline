const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const lessMiddleware = require('less-middleware');
const hbs = require('hbs');
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
const partialsPath = path.join(__dirname, '../views/partials');
const port = process.env.PORT || 3000;
var app = new express();
var server = http.createServer(app);
var io = socketIO(server);
hbs.registerPartials(partialsPath);
app.set('view engine', 'hbs');
app.use(express.static(publicPath));
app.get('/admin', (req, res) => {
    res.render('admin.hbs', {
        rowClick: () => {
            window.alert("");
        }
    });
});
app.get('/', (req, res) => {
    res.render('index.hbs');
});

io.on('connection', (socket) => {
    console.log(partialsPath);
    socket.on("getAllSubjects", (callback) => {
        Subject.find({}, (err, subjects) => {
            callback(subjects);
        });

    });
    socket.on("getSubjectName", (id, callback) => {
        Subject.findById(id, function (err, doc) {
            callback(err, doc.name);
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
    socket.on("newAlumni", (image, alumni, callback) => {
        console.log("NEW ALUMNI TRYING TO INSERT");
        newAlumni = new Alumni(alumni);
        newAlumni.save().then(() => {
            newImage(alumni,image);
            callback("Alumni Was Added");
        }).catch((e) => {
            callback(JSON.stringify(e, null, 2));
        });
    });
    function newImage(alumni,image){
        if (!image) {
            console.log("No Image Entered");
        } else {
            var imagePath = publicPath + "/images/" + alumni.email + "." + image.format;
            console.log(imagePath);
            fs.writeFile(imagePath, image.image, (err) => {
                if (err) {
                    console.log("Problem Writing Files");
                    console.log(err);
                } else {
                    console.log("File Added Successfully");
                }
            });
        }
        
    }
    socket.on("getImage", (email, callback) => {
        var found = false;
        fs.readdir(publicPath + "/images", (err, files) => {
            files.forEach(file => {
                if (file.split(email).length > 1) {
                    found = true;
                    callback(file);

                }
            });
            if (!found) {
                callback("default.jpg");
            }
            callback();
        });
    });

    socket.on("updateAlumni", (prevAlum, alumni, image, callback) => {
        var prevImage;
        Alumni.findOneAndUpdate(prevAlum, alumni, (err, doc) => {
            if (err) {
                callback("Error on updating Alumni");
            } else {
                var found = false;
                fs.readdir(publicPath + "/images", (err, files) => {
                    files.forEach(file => {
                        if (file.split(prevAlum.email).length > 1) {
                            found = true;
                            prevImage = file;
                        }
                    });
                    if (found) {
                        console.log(prevImage);
                        fs.unlink(publicPath+'/images/'+prevImage, function (err) {
                            if (err) throw err;
                            console.log('File deleted!');
                            updateImage(alumni,image);
                        });

                    }
                    else{
                        newImage(alumni,image);
                    }
                });
                callback("Alumni updated successfully");
            }
        });
    });

    function updateImage(alumni, image) {
        if (!image) {
            console.log("No Image Entered");
        } else {
            var imagePath = publicPath + "/images/" + alumni.email + "." + image.format;
            console.log(imagePath);
            fs.writeFile(imagePath, image.image, (err) => {
                if (err) {
                    console.log("Problem Writing Files");
                    console.log(err);
                } else {
                    console.log("File Added Successfully");
                }
            });
        }

    }
    socket.on("updateSubject", (prevSubject, newSubject, callback) => {
        Subject.findOneAndUpdate({
            name: prevSubject
        }, {
            name: newSubject
        }, (err, doc) => {
            callback(err, prevSubject);
        });
        Alumni.find({}, (err, docs) => {
            docs.forEach(doc => {
                var subjects = doc.subjects;
                subjects.forEach(subject => {
                    if (subject.name == prevSubject) {
                        subject.name = newSubject;
                    }
                });
                Alumni.findOneAndUpdate({
                    _id: doc.id
                }, {
                    subjects
                }, (err) => {
                    if (err == null) {
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
        if (filter.subjects.length != 0) {}
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