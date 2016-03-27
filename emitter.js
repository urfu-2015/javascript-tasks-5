module.exports = function () {
    var collection = {};
    var countSeveral = 0;
    var countEmit = 0;
    var countThrough;

    return {
        /**
         * Наполняет collection данными про вызванное событие и соотвествующие ему данные
         * @param eventName {String}
         * @param student {Object}
         * @param callback {Function}
         */
        on: function (eventName, student, callback) {
            if (!collection[eventName]) {
                collection[eventName] = [];
            }

            var eventItem = {
                student: student,
                callback: callback.bind(student)
            };

            if (eventName.indexOf('.') !== -1) {
                var parentName = eventName.split('.')[0];
                var parentEventItems = collection[parentName];

                parentEventItems.forEach(function (item) {
                    if (item.student === student) {
                        eventItem.callbackParent = item.callback;
                    }
                });
            }
            collection[eventName].push(eventItem);
        },

        /**
         * Удаляет оъект из collection
         * @param eventName {String}
         * @param student {Object}
         */
        off: function (eventName, student) {
            var events;
            if (eventName.indexOf('.') === -1) {
                events = Object.keys(collection).filter(function (name) {
                    return name.indexOf(eventName) !== -1;
                });
            } else {
                events = [eventName];
            }

            events.forEach(function (event) {
                collection[event].forEach(function (item, i) {
                    if (item.student === student) {
                        collection[event].splice(i, 1);
                    }
                });
            });
        },

        /**
         * Вызывает колбеки, которые в collection соотвествуют полученному имени события
         * @param eventName {String}
         */
        emit: function (eventName) {
            countEmit++;

            if (countSeveral && countEmit > countSeveral) {
                return;
            }

            if (countThrough && countEmit % countThrough !== 0) {
                return;
            }

            var eventItems = collection[eventName];
            eventItems && eventItems.forEach(function (item) {
                item.callback();
                item.callbackParent && item.callbackParent();
            });
        },

        several: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            countSeveral = isNaN(n) ? 0 : n;
        },

        through: function (eventName, student, callback, n) {
            this.on(eventName, student, callback);
            countThrough = n;
        }
    };
};
