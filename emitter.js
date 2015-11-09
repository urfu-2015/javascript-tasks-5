/**
 * @author Savi
 * Основной метод, который предоставляет интерфейс из 4х функций
 *
 * @return {function} on - подписка на событие
 * @return {function} off - отписка от события
 * @return {function} emit - вызов события
 * @return {function} several - аналог on, но событие может наступить только n раз
 * @return {function} through - аналог on, но наступление события будет происходить каждый n-нный
 *                              раз
 */
module.exports = function () {
    var inf = Infinity;

    /**
     * Конструктор, создаёт слушателя, который имеет 2 свойства
     * student - сам объект слушателя,
     * cbs - набор колбэков на те или иные события.
     *
     * @param {string} eventName - имя самого события
     * @param {object} student - студент, для которого оно описывается
     * @param {function} callback - сама функция ответа на событие
     * @param {number} n - сколько раз событие может наступить
     * @param {number} whenRep - через сколько вызовов событие должно наступить
     * @param {number} currentCall - сколько раз событие уже было вызвано
     * @this {Listener}
     * @constructor
     */
    function Listener(eventName, student, callback, n, whenRep, currentCall) {
        // @private
        this.student = student;
        // @private
        this.cbs = {};
        this.cbs[eventName] = cbObj(callback, n, whenRep, currentCall);
    }

    function cbObj(cb, callsLeft, whenRep, currentCall) {
        var cbObj = {
            cb: cb, callsLeft: callsLeft, whenRep: whenRep,
            currentCall: currentCall
        };
        return cbObj;
    }

    // набор слушателей
    var listeners = [];
    // все студенты, которые как-то задействованы
    var signedStudents = [];

    /**
     * Метод умной подписки на событие. Весь его ум в том, что он дважды не создаёт слушателя,
     * если такой уже есть.
     *
     * @param {string} eventName - имя самого события
     * @param {object} student - студент, для которого оно описывается
     * @param {function} callback - сама функция ответа на событие
     * @param {number} n - сколько раз событие может наступить
     * @param {number} whenRep - через сколько вызовов событие должно наступить
     * @param {number} currentCall - сколько раз событие уже было вызвано
     */
    function smartOn(eventName, student, callback, n, whenRep, currentCall) {
        if (typeof eventName === 'string' &&
            typeof student === 'object' &&
            typeof callback === 'function') {
            var index = signedStudents.indexOf(student);
            if (index > -1) {
                // Добавляем ещё одно событие, на которое реагирует слушатель
                listeners[index]['cbs'][eventName] = cbObj(callback, n, whenRep, currentCall);
            } else {
                listeners.push(new Listener(eventName, student, callback, n, whenRep, currentCall));
                signedStudents.push(student);
            }
        }
    }

    /**
     * Метод умного колла, который вызывает обработчик для студента.
     * Весь его ум в том, что он меняет счётчики: сколько раз уже было обработано
     * то или иное событие и сколько осталось.
     *
     * @param {object} item - сам студент
     * @param {string} eventName - имя события
     */
    function smartCall(item, eventName) {
        item['cbs'][eventName]['cb'].call(item['student']);
        item['cbs'][eventName]['currentCall']++;
        item['cbs'][eventName]['callsLeft']--;
    }

    /**
     * Вспомогательная функция отписки от события, которая учитывает все уровни
     *
     * @param {string} eventName - имя события
     * @param {number} indexStudent - номер студента в списке 'listeners'
     */
    function smartOff(eventName, indexStudent) {
        // Простая отписка
        if (eventName in listeners[indexStudent]['cbs']) {
            delete listeners[indexStudent]['cbs'][eventName];
        }
        // Проверка остальных уровней
        for (var cb in listeners[indexStudent]['cbs']) {
            if (cb.indexOf(eventName) > -1) {
                delete listeners[indexStudent]['cbs'][cb];
            }
        }
    }

    return {
        /**
         * Данный метой является аналогом метода smartOn. По его вызову мы понимаем,
         * какие параметры мы должны передать smartOn, чтобы произошла правильная подписка,
         * соотвествующая семантике метода on, т.е. обработчик может быть вызван сколь
         * угодно раз -> n = inf; он срабатывает на каждый вызов -> whenRep = -1; сколько вызовов
         * было совершено -> currentCall = 0.
         *
         * @param {string} eventName - имя события
         * @param {object} student - сам студент
         * @param {function} callback - обработчик события
         */
        on: function (eventName, student, callback) {
            smartOn(eventName, student, callback, inf, -1, 0);
        },

        /**
         * Данный метод отписывает студента от определённого события.
         * @param {string} eventName - имя события
         * @param {object} student - сам студент
         */
        off: function (eventName, student) {
            if (typeof eventName === 'string' &&
                typeof eventName !== 'undefined' &&
                typeof student === 'object') {
                var index = signedStudents.indexOf(student);
                if (index > -1) {
                    smartOff(eventName, index);
                }
            }
        },

        /**
         * Метод вызова события.
         *
         * @param {string} eventName - имя события
         */
        emit: function extendedEmit(eventName) {
            if (typeof eventName === 'string' && typeof eventName !== 'undefined') {
                var events = eventName.split('.');
                var oneMoreEv;
                // Если событие является многоуровнеевым, то стоит вызвать событие n - 1 уровня
                if (events.length > 1) {
                    events.splice(events.length - 1, events.length);
                    oneMoreEv = events.join('.');
                }
                // Вызываем обработчик события для каждого студента, который подписан на него
                listeners.forEach(function (item) {
                    if (eventName in item['cbs']) {
                        // Выясняем тип подписки и выполняем её, если она типа 'on' или 'through
                        if (!isFinite(item['cbs'][eventName]['callsLeft'])) {
                            // Тип 'through'
                            if (item['cbs'][eventName]['whenRep'] != -1) {
                                // Если настал наш черёд - вызываем
                                if (((item['cbs'][eventName]['currentCall'] != 0) &&
                                    ((item['cbs'][eventName]['currentCall'] + 1) %
                                    item['cbs'][eventName]['whenRep'] == 0) ||
                                    (item['cbs'][eventName]['whenRep'] == 1))) {
                                    smartCall(item, eventName);
                                } else {
                                    // Иначе учитываем, что нас пытались вызвать
                                    item['cbs'][eventName]['currentCall']++;
                                }
                            } else {
                                // Тип 'on'
                                smartCall(item, eventName);
                            }
                        } else {
                            // Тип 'several'. Вызываем, если ещё имеем право
                            if (item['cbs'][eventName]['callsLeft'] > 0) {
                                smartCall(item, eventName);
                            }
                        }
                    }
                });
                // Вызов события родительского уровня
                extendedEmit(oneMoreEv);
            }
        },

        /**
         * Данный метой является аналогом метода smartOn. По его вызову мы понимаем,
         * какие параметры мы должны передать smartOn, чтобы произошла правильная подписка,
         * соотвествующая семантике метода several, т.е. обработчик может быть вызван только
         * определенное количество раз -> n = n; он срабатывает на каждый вызов -> whenRep = -1;
         * сколько вызовов было совершено -> currentCall = 0.
         *
         * @param {string} eventName - имя события
         * @param {object} student - сам студент
         * @param {function} callback - обработчик события
         * @param {number} n - сколько раз
         */
        several: function (eventName, student, callback, n) {
            if (n > 0) {
                smartOn(eventName, student, callback, n, -1, 0);
            }
        },

        /**
         * Данный метой является аналогом метода smartOn. По его вызову мы понимаем,
         * какие параметры мы должны передать smartOn, чтобы произошла правильная подписка,
         * соотвествующая семантике метода through, т.е. обработчик может быть вызван сколь угодно
         * раз -> n = inf; он срабатывает на каждый n-нный вызов -> whenRep = n;
         * сколько вызовов было совершено -> currentCall = 0.
         *
         * @param {string} eventName - имя события
         * @param {object} student - сам студент
         * @param {function} callback - обработчик события
         * @param {number} n - сколько раз
         */
        through: function (eventName, student, callback, n) {
            if (n > 0) {
                smartOn(eventName, student, callback, inf, n, 0);
            }
        }
    };
};
