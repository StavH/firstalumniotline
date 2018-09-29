var socket = io();
socket.emit("getAllSubjects", function (subjects) {
    subjects.forEach(subject => {
        var label = $('<label class="form-group form-check-label">' + subject.name + '</label>');
        var input = $('<input type="checkbox" class="form-group form-check-input" value="' + subject.name + '" />')
        label.prepend(input);
        $('#subjectsList').append(label);
    });
});
socket.emit("getAllAlumnis", function (alumnis) {
    alumnis.forEach(alumni => {
        var row = $('<div class="d-inline-flex col-12 justify-content-center"></div>');
        var image = $('<div class="d-flex col-2 border border-secondary">Image</div>');
        var firstName = $('<div class="d-flex col-2 border border-secondary">' + alumni.first_name + '</div>');
        var lastName = $('<div class="d-flex col-2 border border-secondary">' + alumni.last_name + '</div>');
        var subjects = $('<div class="d-flex col-2 border border-secondary">SUBJECTS</div>');
        var Continue = $('<div class="d-flex col-2 border border-secondary"><a href="mailTo:' + alumni.email + '"><button class="btn btn-danger">שלח מייל</button></a><a href="tel:' + alumni.phone + '"><button class="btn btn-success">התקשר</button></a></div>');
        row.append(image);
        row.append(firstName);
        row.append(lastName);
        row.append(subjects);
        row.append(Continue);
        $('#alumnis').append(row);

    });
});