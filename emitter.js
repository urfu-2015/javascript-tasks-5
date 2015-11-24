module.exports = function () {
    // Храним все объекты - студенты
    var subscribedStudents = [];
    // По событиям храним студентов
    var eventsInfo = {};
    // Состояния вызовов событий
    var eventsStatus = {};
    var prepareForSubscribe = function (eventName, student) {
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
        // Если события первого уровня нет, добавим его
        if (!eventsInfo[eventNames[0]]) {
            eventsInfo[eventNames[0]] = {};
            eventsInfo[eventNames[0]][eventNames[0]] = [];
        }

        // Если нет события второго уровня
        if (!eventsInfo[eventNames[0]][eventNames[1]]) {
            eventsInfo[eventNames[0]][eventNames[1]] = [];
        }

        // Добавим структуру для посчета исполнений события
        if (!eventsStatus[eventName]) {
            eventsStatus[eventName] = {count: 0};
        }

        return {
            eventNames: eventNames,
            studentIndex: studentIndex
        };
    };
    return {
        on: function (eventName, student, callback) {
            var subData = prepareForSubscribe(eventName, student);
            var eventNames = subData['eventNames'];
            var studentIndex = subData['studentIndex'];
            // Добавим данные для события
            // Пример begin -> begin -> [{данные}, ...]
            eventsInfo[eventNames[0]][eventNames[1]].push({
                id: studentIndex,
                callback: callback,
                every: -1,
                several: -1});
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
            // Если дали просто begin не забываем, что это первый уровень
            var firstLevelEventFlag = false;
            if (eventNames.length === 1) {
                firstLevelEventFlag = true;
                eventNames.push(eventNames[0]);
            }
            // Если переданное событие еще не вызывалось, создадим счетчик для него
            if (!eventsStatus[eventName]) {
                eventsStatus[eventName] = {count: 0};
                return;
            }
            // Если событие первого уровня, то смотрим только его
            // Если событие 2-ого уровня - вызываем его и родителя
            if (firstLevelEventFlag) {
                eventsInfo[eventNames[0]][eventNames[1]].forEach(function (student, index, array) {
                    // Смотрим, заданы ли параметры
                    if (student['every'] > 0) {
                        if (eventsStatus[eventName]['count'] % student['every'] === 0) {
                            student.callback.apply(subscribedStudents[student['id']]);
                        }
                    }
                    if (student['several'] > 0) {
                        student.callback.apply(subscribedStudents[student['id']]);
                        student['several']--;
                    } else if (student['several'] === 0) {
                        this.off(eventName, subscribedStudents[student['id']]);
                    }
                    if (student['several'] < 0 && student['every'] < 0) {
                        student.callback.apply(subscribedStudents[student['id']]);
                    }
                }, this);
            } else {
                // Вызываем само событие
                eventsInfo[eventNames[0]][eventNames[1]].forEach(function (student, index, array) {
                    student.callback.apply(subscribedStudents[student['id']]);
                }, this);
                // Вызываем его родителя
                eventsInfo[eventNames[0]][eventNames[0]].forEach(function (student, index, array) {
                    student.callback.apply(subscribedStudents[student['id']]);
                }, this);
            }
            // Записываем состояния исполнения
            eventsStatus[eventName]['count']++;
        },

        several: function (eventName, student, callback, n) {
            var subData = prepareForSubscribe(eventName, student);
            var eventNames = subData['eventNames'];
            var studentIndex = subData['studentIndex'];
            // Добавим данные для события
            // Пример begin -> begin -> [{данные}, ...]
            eventsInfo[eventNames[0]][eventNames[1]].push({
                id: studentIndex,
                callback: callback,
                every: -1,
                several: n});
        },

        through: function (eventName, student, callback, n) {
            var subData = prepareForSubscribe(eventName, student);
            var eventNames = subData['eventNames'];
            var studentIndex = subData['studentIndex'];
            // Добавим данные для события
            // Пример begin -> begin -> [{данные}, ...]
            eventsInfo[eventNames[0]][eventNames[1]].push({
                id: studentIndex,
                callback: callback,
                every: n,
                several: -1});
        }
    };
};
