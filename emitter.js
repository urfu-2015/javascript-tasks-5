module.exports = function () {
    var students = [];
    return {
        on: function (eventName, student, callback) {
            var studentIndex = findStudent(students, student, 'student');
            if (studentIndex !== null) {
                students[studentIndex].property.push({eventName: eventName, callback: callback});
            } else {
                var student = {
                    student: student, property: [{eventName: eventName, callback: callback}]
                };
                students.push(student);
            }
        },

        off: function (eventName, student) {
            var studentIndex = findStudent(students, student, 'student');
            if (studentIndex !== null) {
                var property = students[studentIndex].property;
                var propertyIndex = findEventName(property, eventName, 'eventName');
                if (propertyIndex.length > 0) {
                    for (var k = 0; k < propertyIndex.length; k++) {
                        students[studentIndex].property.splice(propertyIndex[k], 1);
                    }
                }
            }
        },

        emit: function (eventName) {
            var eventNameArray = eventName.split('.');
            for (var k = 1; k < eventNameArray.length; k++) {
                eventNameArray[k] = eventNameArray[k - 1] + '.' + eventNameArray[k];
            }
            students.forEach(function (student, i) {
                student.property.forEach(function (propetry, j) {
                    eventNameArray.forEach(function (eventName) {
                        if (propetry.eventName === eventName) {
                            students[i].property[j].callback.call(students[i].student);
                        }
                    });
                });
            });
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};

function findStudent(array, element, field) {
    var value = null;
    array.forEach(function (item, i) {
        if (item[field] === element) {
            value = i;
        }
    });
    return value;
}

function findEventName(array, eventName, field) {
    var value = [];
    array.forEach(function (item, i) {
        if (item[field].lastIndexOf(eventName, 0) > -1) {
            value.push(i);
        }
    });
    return value.reverse();
}
