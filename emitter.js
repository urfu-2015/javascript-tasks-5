module.exports = function () {
    return {
        listOfEvents: {},
        on: function (eventName, student, callback) {
            var newEventHandler = {
                student: student,
                function: callback.bind(student)
            };
            if (Object.keys(this.listOfEvents).indexOf(eventName) + 1) {
                this.listOfEvents[eventName].push(newEventHandler);
            } else {
                this.listOfEvents[eventName] = [newEventHandler];
            }
        },

        off: function (eventName, student) { // пространство имён
            if (Object.keys(this.listOfEvents).indexOf(eventName) + 1) {
                var isThereSuchStudent = false;
                for (var i in this.listOfEvents) {
                    if (i.indexOf(eventName) + 1) {
                        var currentList = this.listOfEvents[i];
                        for (var j in currentList) {
                            if (currentList[j]['student'] === student) {
                                isThereSuchStudent = true;
                                currentList.splice(j, 1);
                            }
                        }
                    }
                }
                if (!isThereSuchStudent) {
                    console.error('Такого студента нет!');
                }
            } else {
                console.error('События не существует!');
            }
        },

        emit: function (eventName) {
            for (var i in this.listOfEvents) {
                if (eventName.indexOf(i) + 1) {
                    var currentEvent = this.listOfEvents[i];
                    for (var j in currentEvent) {
                        currentEvent[j]['function']();
                    }
                }
            }
            //console.log('-------------');
        },

        several: function (eventName, student, callback, n) { // в массиве для студента/функции хранится n
            // когда вызываем emit, проверяем, есть ли параметр такой, и если да то — не ноль ли, если нет,
            // выполняем, уменьшаем n

        },

        through: function (eventName, student, callback, n) { // здесь должен быть ещё и счётчик вызовов
        // изначально 0, сначала увеличиваем номер, затем делим по модулю, при каждом вызове

        }
    };
};
