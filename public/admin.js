var socket = io();
socket.emit("getAllSubjects", function (subjects) {
    subjects.forEach(subject => {
        var label = $('<label class="form-group form-check-label">' + subject.name + '</label>');
        var input = $('<input type="checkbox" name="subjects" class="form-group form-check-input" value="' + subject.name + '" />')
        label.prepend(input);
        $('#subjectsList').append(label);
    });
});
$(document).ready(function () {
    $('#addAlumni').click(
        
        function () {
            var subjects = [];
            $('input[name="subjects"]:checked').each(
                function () {
                    subjects.push({
                        name:this.value
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
            alumni = JSON.stringify(alumni);
            socket.emit("newAlumni",alumni,function(message){
                window.alert(message);
            });
        }
    );
    $('#addSubject').click(
        
        function () {
            var subject = {
                name: $('#subject').val()
            };
            subject = JSON.stringify(subject);
            socket.emit("newSubject",subject,function(message){
                window.alert(message);
            });
        }
    );
});