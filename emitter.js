module.exports = function () {
    // Храним все объекты - студенты
    var subscribedStudents = [];
    // По событиям храним студентов
    var eventsInfo = {};
    return {
        on: function (eventName, student, callback) {
            var studentIndex;
            // Если студента нет - добавим
            if (subscribedStudents.indexOf(student) < 0) {
                subscribedStudents.push(student);
                studentIndex = subscribedStudents.length - 1;
            } else {
                studentIndex = subscribedStudents.indexOf(student);
            }

            var eventNames = eventName.split('.');

            // Превращаем событие begin -> begin.begin для однородности
            if (eventNames.length === 1) {
                eventNames.push(eventNames[0]);
            }
            // Если события первого уровня нет
            if (!eventsInfo[eventNames[0]]) {
                eventsInfo[eventNames[0]] = {};
            }

            // Если нет события второго уровня
            if (!eventsInfo[eventNames[0]][eventNames[1]]) {
                eventsInfo[eventNames[0]][eventNames[1]] = [];
            }

            // Добавим данные для события
            // Пример begin -> begin -> [{данные}, ...]
            eventsInfo[eventNames[0]][eventNames[1]].push({
                id: studentIndex,
                callback: callback,
                every: 0,
                count: 1});
        },

        off: function (eventName, student) {
            // Ищем студента
            var studentIndex;
            studentIndex = subscribedStudents.indexOf(student);
            // Превращаем событие begin -> begin.begin для однородности
            var eventNames = eventName.split('.');
            // Но если дали просто begin не забываем, что это первый уровень
            var firstLevelEventFlag = false;
            if (eventNames.length === 1) {
                firstLevelEventFlag = true;
                eventNames.push(eventNames[0]);
            }
            // Если событие первого уровня, то удаляем и все подсобытия
            if (firstLevelEventFlag) {
                var nestedEvents = eventsInfo[eventNames[0]];
                for (var nestedEvent in nestedEvents) {
                    nestedEvents[nestedEvent].forEach(function (student, index, array) {
                        if (student['id'] === studentIndex) {
                            delete array[index];
                        }
                    });
                }
            } else {
                eventsInfo[eventNames[0]][eventNames[1]].forEach(function (student, index, array) {
                    if (student['id'] === studentIndex) {
                        delete array[index];
                    }
                });
            }
        },

        emit: function (eventName) {
            // Превращаем событие begin -> begin.begin для однородности
            var eventNames = eventName.split('.');
            // Но если дали просто begin не забываем, что это первый уровень
            var firstLevelEventFlag = false;
            if (eventNames.length === 1) {
                firstLevelEventFlag = true;
                eventNames.push(eventNames[0]);
            }
            if (firstLevelEventFlag) {
                eventsInfo[eventNames[0]][eventNames[1]].forEach(function (student, index, array) {
                    student['callback'].apply(subscribedStudents[student['id']]);
                });
            } else {
                var nestedEvents = eventsInfo[eventNames[0]];
                for (var nestedEvent in nestedEvents) {
                    nestedEvents[nestedEvent].forEach(function (student, index, array) {
                        student['callback'].apply(subscribedStudents[student['id']]);
                    });
                }
            }

        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
