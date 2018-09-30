
var socket = io();
function showAlumnisFromArray(alumnis) {
    $('#alumnis').empty();
    alumnis.forEach(alumni => {
        var subjectList = "";
        alumni.subjects.forEach(subject => {
            subjectList += subject.name + ", ";
        });
        subjectList = subjectList.substring(0, subjectList.length - 2);
        var row = $('<div class="d-inline-flex col-12 justify-content-center"></div>');
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
        $('#alumnis').append(row);

    });
}
socket.emit("getAllSubjects", function (subjects) {
    subjects.forEach(subject => {
        var label = $('<label class="form-group form-check-label">' + subject.name + '</label>');
        var input = $('<input type="checkbox" name="subjects" class="form-group form-check-input" value="' + subject.name + '" />')
        label.prepend(input);
        $('#subjectsList').append(label);
    });
});
socket.emit("getAllAlumnis", function (alumnis) {
    showAlumnisFromArray(alumnis);
});
$(document).ready(function () {
    $('btnReset').click(function(){
        $('input[name="subjects"]:checked').each(
            function () {
                this.prop('checked',false);
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
                        name:this.value
                    });
                }
            );
        var filter = {
            first_name: $('#firstName').val(),
            last_name: $('#lastName').val(),
            subjects
        };
        console.log(filter);
        socket.emit("getAlumnisFiltered",filter,function(alumnis,err){
            if(err){
                window.alert("No Matching Alumnis");
            }
            else{
                console.log(alumnis);
                showAlumnisFromArray(alumnis);
            }
        });
    });
});

