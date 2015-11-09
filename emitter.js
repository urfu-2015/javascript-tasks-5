var students = [];

module.exports = function () {
    return {
        on: function (eventName, student, callback) {
            var studentIndex = findStudent(student, 'student');
            if (studentIndex === -1) {
                studentIndex = students.push({ student: student, property: [] }) - 1;
            }
            students[studentIndex].property.push({eventName: eventName, callback: callback});
        },



        off: function (eventName, student) {
            var studentIndex = findStudent(student, 'student');
            if (studentIndex > -1) {
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

function findStudent(element, field) {
    var value = -1;
    for (i = 0; i < students.length; i++) {
        if (students[i][field] === element) {
            value = i;
            break;
        }
    }
    return value;
}

function findEventName(array, eventName, field) {
    return array.reduce(function (previousValue, currentItem, i) {
        if (currentItem[field].lastIndexOf(eventName, 0) > -1 || currentItem[field] === eventName) {
            previousValue.unshift(i);
        }
        return previousValue;
    }, [ ]);
}
