var socket = io();

function getSubjectName(id) {
    socket.emit("getSubjectName", id, function (err, name) {
        return name;
    });
}

function showAlumnisFromArray(alumnis) {
    $('#alumnis').empty();
    alumnis.forEach(alumni => {
        socket.emit("getImage", alumni.email, function (image) {
            var imageFile = image;
            var subjectList = "";
            alumni.subjects.forEach(subject => {
                subjectList += subject.name + ", ";
            });
            
            subjectList = subjectList.substring(0, subjectList.length - 2);
            var row = $('<div id="' + alumni.email + '" name="alumni" data-toggle="modal"  data-target="#myModal" class="row justify-content-center"></div>');
            var imageDiv = $('<div class="alumniContent col-2 border border-secondary"><img class="alumniImg" src="/images/' + image + '"></div>');
            var firstName = $('<div class="alumniContent col-2 border border-secondary">' + alumni.first_name + '</div>');
            var lastName = $('<div class="alumniContent col-2 border border-secondary">' + alumni.last_name + '</div>');
            var subjects = $('<div class="alumniContent col-2 border border-secondary">' + subjectList + '</div>');
            var Continue = $('<div class="alumniContent col-2 border border-secondary"><a href="mailTo:' + alumni.email + '"><button class="btn btn-danger alumniBtn">שלח מייל</button></a><a href="tel:' + alumni.phone + '"><button class="btn btn-success alumniBtn">התקשר</button></a></div>');
            
            row.append(imageDiv);
            row.append(firstName);
            row.append(lastName);
            row.append(subjects);
            row.append(Continue);
            
            row.on('click', function () {
                
                $('.modal-title').text(alumni.first_name + " " + alumni.last_name);
                
                $('.modal-body').html(
                    $('<div class="card"><img class="card-img-top" src="/images/' + imageFile + '" alt="Card image"><div class="card-header">פרטים נוספים</div><div class="card-body">' + alumni.details + '</div></div><div class="card"><div class="card-header">טלפון</div><div class="card-body">' + alumni.phone + '</div></div><div class="card"><div class="card-header">אימייל</div><div class="card-body">' + alumni.email + '</div></div>')
                );
            });
            $('#alumnis').append(row);

        });

    });
}
socket.emit("getAllSubjects", function (subjects) {
    subjects.forEach(subject => {
        var label = $('<label class="subjects">' + subject.name + '</label>');
        var input = $('<input type="checkbox" name="subjects" value="' + subject.name + '" />')
        label.prepend(input);
        $('#subjectsList').append(label);
    });
});
socket.emit("getAllAlumnis", function (alumnis) {
    showAlumnisFromArray(alumnis);
});

$(document).ready(function () {
    $('btnReset').click(function () {
        $('input[name="subjects"]:checked').each(
            function () {
                this.prop('checked', false);
            }
        );
        $('#firstName').val() = "";
        $('#lastName').val() = "";
    });
    $('#btnSearch').click(function () {
        var subjects = [];
        $('input[name="subjects"]:checked').each(
            function () {
                subjects.push({
                    name: this.value
                });
            }
        );
        var filter = {
            first_name: $('#firstName').val(),
            last_name: $('#lastName').val(),
            subjects
        };
        socket.emit("getAlumnisFiltered", filter, function (alumnis, err) {
            if (err) {
                window.alert("No Matching Alumnis");
            } else {
                showAlumnisFromArray(alumnis);
            }
        });
    });
});