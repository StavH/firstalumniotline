var socket = io();
var updateMode = "alumni";
var prevAlum;

function showAlumnisFromArray(alumnis) {
    $('#alumnis').empty();
    alumnis.forEach(alumni => {
        var subjectList = "";
        var subjectsAlum = [];
        alumni.subjects.forEach(subject => {
            subjectList += subject.name + ", ";
            subjectsAlum.push(subject.name);
        });
        subjectList = subjectList.substring(0, subjectList.length - 2);
        var row = $('<div id="' + alumni.email + '" name="alumni" data-toggle="modal" data-target="#myModal" class="d-inline-flex col-12 justify-content-center"></div>');
        var image = $('<div class="d-flex col-2 border border-secondary">Image</div>');
        var firstName = $('<div class="d-flex col-2 border border-secondary">' + alumni.first_name + '</div>');
        var lastName = $('<div class="d-flex col-2 border border-secondary">' + alumni.last_name + '</div>');
        var subjects = $('<div class="d-flex col-2 border border-secondary">' + subjectList + '</div>');
        var Continue = $('<div class="d-flex col-2 border border-secondary"><a href="mailTo:' + alumni.email + '"><button class="btn btn-danger">שלח מייל</button></a><a href="tel:' + alumni.phone + '"><button class="btn btn-success">התקשר</button></a></div>');
        row.append(image);
        row.append(firstName);
        row.append(lastName);
        row.append(subjects);
        row.append(Continue);
        row.on('click', function () {
            prevAlum = alumni;
            updateMode = "alumni";
            $('#firstNameModal').val(alumni.first_name);
            $('#lastNameModal').val(alumni.last_name);
            $('#emailModal').val(alumni.email);
            $('#phoneModal').val(alumni.phone);
            $('#detailsModal').val(alumni.details);
            $('input[name="subjectsModal"]').map(function () {
                if (subjectsAlum.includes(this.value)) {
                    this.checked = true;
                }
            });
        });
        console.log(row);
        $('#alumnis').append(row);

    });
}

// socket.emit("getAllSubjects", function (subjects) {
//     subjects.forEach(subject => {
//         var label = $('<label class="form-group form-check-label">' + subject.name + '</label>');
//         var input = $('<input type="checkbox" name="subjects" class="form-group form-check-input" value="' + subject.name + '" />')
//         label.prepend(input);
//         var labelModal = $('<label class="form-group form-check-label">' + subject.name + '</label>');
//         var inputModal = $('<input type="checkbox" name="subjectsModal" class="form-group form-check-input" value="' + subject.name + '" />')
//         labelModal.prepend(inputModal);

//         $('#subjectsList').append(label);
//         $('#modalList').append(labelModal);
//     });
// });
$(document).ready(function () {
    var modalBody= $('.modal-body').html();
    $('#btnUpdateSubject').click(function () {
        updateMode = "subjects";
        $('.modal-title').text("עדכון תחומי עניין");
        $('.modal-body').html("");
        socket.emit("getAllSubjects", function (subjects) {
            subjects.forEach(subject => {
                $('.modal-body').html($('.modal-body').html() + '<div class="card"><input type="text" name="subjectUpdate" id="' + subject.name + '" class="form-control" value="' + subject.name + '"' + '</div>');
            });
        });
    });
    $('#btnReset').click(function () {
        $('input[name="subjects"]:checked').each(
            function () {
                this.prop('checked', false);
            }
        );
        $('#firstName').val() = "";
        $('#lastName').val() = "";
    });
    console.log($('div[name="alumni"]'));
    $('#btnSearch').click(function () {
        var subjects = [];
        $('input[name="subjects"]:checked').each(
            function () {
                subjects.push({
                    id: this.value
                });
            }
        );
        var filter = {
            first_name: $('#firstName').val(),
            last_name: $('#lastName').val(),
            subjects
        };
        console.log(filter);
        socket.emit("getAlumnisFiltered", filter, function (alumnis, err) {
            if (err) {
                window.alert("No Matching Alumnis");
            } else {
                console.log(alumnis);
                showAlumnisFromArray(alumnis);
            }
        });
    });
    $('#addAlumni').click(
        function () {
            
            var subjects = [];
            $('input[name="subjects"]:checked').each(
                function () {
                    console.log(this);
                    subjects.push({
                        name: this.value

                    });
                }
            );
            var alumni = {
                first_name: $('#firstName').val(),
                last_name: $('#lastName').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                details: $('#desc').val(),
                subjects
            };
            if(document.querySelector('#image').files[0] != undefined){
                var imageName = document.querySelector('#image').files[0].name;
                var imageFile = {
                    image: document.querySelector('#image').files[0],
                    format: imageName.substring(imageName.length - 3, imageName.length)
                };
            }
            else{
                var imageFile = null;
            }
            console.log(imageFile);
            socket.emit("newAlumni", imageFile, alumni, function (message) {
                console.log("SSS");
                window.alert(message);
                location.reload();
            });
        }
    );
    $('#imageReset').click(function () {
        $('#image').val("");
        
    });
    $('#update').click(function () {
        if (updateMode == "alumni") {
            if (prevAlum != null) {
                var subjects = [];
                $('input[name="subjectsModal"]:checked').each(
                    function () {
                        subjects.push({
                            name: this.value
                        });
                    }
                );
                var alumni = {
                    first_name: $('#firstNameModal').val(),
                    last_name: $('#lastNameModal').val(),
                    email: $('#emailModal').val(),
                    phone: $('#phoneModal').val(),
                    details: $('#detailsModal').val(),
                    subjects
                };
                socket.emit("updateAlumni", prevAlum, alumni, function (message) {
                    window.alert(message);
                    location.reload();
                });
x

            } else {
                window.alert("Error");
            }
        }
        if (updateMode == "subjects") {
            console.log("subjects");
            var subjects = [];
            $('input[name="subjectUpdate"]').each(function () {
                socket.emit('updateSubject', this.id, this.value, function (err, prevSubject) {
                    if (err) {
                        window.alert("Couldn't Update " + prevSubject);
                    }
                    location.reload();
                });
            });
            
            $('.modal-body').html(modalBody);
        }
    });
    $('#addSubject').click(

        function () {
            var subject = {
                name: $('#subject').val()
            };
            subject = JSON.stringify(subject);
            socket.emit("newSubject", subject, function (message) {
                window.alert(message);
                location.reload();
            });
        }
    );
});