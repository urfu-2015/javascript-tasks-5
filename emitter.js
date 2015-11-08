module.exports = function () {
    var students = [];
    return {
        on: function (eventName, student, callback) {
            var studentIndex = getIndexStudentName(students, student);
            return studentIndex > -1 ?
                students[studentIndex].events.push(
                    {
                        eventName: eventName,
                        func: callback
                    })
                :
                students.push(
                    {
                        studentName: student,
                        events: [
                        {
                            eventName: eventName,
                            func: callback
                        }]
                    });
        },
        off: function (eventName, student) {
            for (var i = 0; i < students.length; i++) {
                if (students[i].studentName === student) {
                    students[i].events = students[i].events.filter(function (event) {
                        return event.eventName.indexOf(eventName) === -1;
                    });
                }
            }
        },
        emit: function (eventName) {
            students.forEach(function (student) {
                var listEvent = eventName.split('.');
                var oneEvent = listEvent[0];
                for (var i = 0; i < listEvent.length; i++) {
                    if (i > 0) {
                        oneEvent += '.' + listEvent[i];
                    }
                    student.events.forEach(function (event) {
                        if (event.eventName === oneEvent) {
                            var callBack = event.func;
                            callBack.apply(student.studentName);
                        }
                    });
                }
            });
        }
    };
};
function getIndexStudentName(array, key) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].studentName === key) {
            return i;
        }
    }
    return -1;
}
