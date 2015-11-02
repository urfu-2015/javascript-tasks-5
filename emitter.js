module.exports = function () {
    var students = [];
    return {
        on: function (eventName, student, callback) {
            var studentIndex = findElementFromArray(students, student, 'student');
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
            var studentIndex = findElementFromArray(students, student, 'student');
            if (studentIndex !== null) {
                var property = students[studentIndex].property;
                var propertyIndex = findElementFromArray(property, eventName, 'eventName');
                if (propertyIndex !== null) {
                    students[studentIndex].property.splice(propertyIndex, 1);
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

function findElementFromArray(array, element, field) {
    var value = null;
    array.forEach(function (item, i) {
        if (item[field] === element) {
            value = i;
        }
    });
    return value;
}
