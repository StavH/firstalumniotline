var socket = io();
socket.emit("getAllSubjects", function (subjects) {
    subjects.forEach(subject => {
        var label = $('<label class="form-group form-check-label">' + subject.name + '</label>');
        var input = $('<input type="checkbox" class="form-group form-check-input" value="' + subject.name + '" />')
        label.prepend(input);
        $('#subjectsList').append(label);
    });
});