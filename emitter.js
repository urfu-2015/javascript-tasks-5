var students = [];

module.exports = function () {
    return {
        on: function (eventName, student, callback) {
            var student = {
                student: student, property: {eventName: eventName, callback: callback }
            };
            students.push(student);
        },

        off: function (eventName, student) {
            var studentIndex = findStudent(student, eventName);
            if (studentIndex.length > 0) {
                for (var k = 0; k < studentIndex.length; k++) {
                    students.splice(studentIndex[k], 1);
                }
            }
        },

        emit: function (eventName) {
            var eventNameArray = eventName.split('.');
            for (var k = 1; k < eventNameArray.length; k++) {
                eventNameArray[k] = eventNameArray[k - 1] + '.' + eventNameArray[k];
            }
            students.forEach(function (student, i) {
                eventNameArray.forEach(function (eventName) {
                    if (student.property.eventName === eventName) {
                        students[i].property.callback.call(students[i].student);
                    }
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
    return students.reduce(function (previousValue, currentItem, i) {
        if (currentItem.student === element && (currentItem.property.eventName === field ||
            currentItem.property.eventName.lastIndexOf(field + '.', 0) > -1)) {
            previousValue.unshift(i);
        }
        return previousValue;
    }, [ ]);
}

function findEventName(array, eventName, field) {
    return array.reduce(function (previousValue, currentItem, i) {
        if (currentItem[field].lastIndexOf(eventName, 0) > -1 || currentItem[field] === eventName) {
            previousValue.unshift(i);
        }
        return previousValue;
    }, [ ]);
}
