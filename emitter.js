/**
 * @author Savi
 * Основной метод, который предоставляет интерфейс из 4х функций -
 * on - подписка на событие,
 * off - отписка от события,
 * emit - вызов события,
 * several - аналог on, но событие может наступить только n раз,
 * through - аналог on, но наступление события будет происходить каждый n-нный раз.
 *
 * @return {function} on
 * @return {function} off
 * @return {function} emit
 * @return {function} several
 * @return {function} through
 */
module.exports = function () {
    var inf = Infinity;

    /**
     * Конструктор, создаёт слушателя, который имеет 2 свойства
     * student - сам объект слушателя,
     * cbs - набор колбэков на те или иные события.
     *
     * @param {string} eventName
     * @param {object} student
     * @param {function} callback
     * @param {number} n
     * @param {number} whenRep
     * @param {number} currentCall
     * @this {Listener}
     * @constructor
     */
    function Listener(eventName, student, callback, n, whenRep, currentCall) {
        /** @private */
        this.student = student;
        /** @private */
        this.cbs = {};
        this.cbs[eventName] = [callback, n, whenRep, currentCall];
    }

    /** набор слушателей */
    var listeners = [];
    /** все студенты, которые как-то задействованы */
    var signedStudents = [];

    /**
     * Метод умной подписки на событие. Весь его ум в том, что он дважды не создаёт слушателя,
     * если такой уже есть.
     *
     * @param {string} eventName
     * @param {object} student
     * @param {function} callback
     * @param {number} n
     * @param {number} whenRep
     * @param {number} currentCall
     */
    function smartOn(eventName, student, callback, n, whenRep, currentCall) {
        if (typeof eventName === 'string' &&
            typeof student === 'object' &&
            typeof callback === 'function') {
            var index = signedStudents.indexOf(student);
            if (index > -1) {
                /** Добавляем ещё одно событие, на которое реагирует слушатель */
                listeners[index]['cbs'][eventName] = [callback, n, whenRep, currentCall];
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
     * @param {object} item
     * @param {string} eventName
     */
    function smartCall(item, eventName) {
        item['cbs'][eventName][0].call(item['student']);
        item['cbs'][eventName][3]++;
        item['cbs'][eventName][1]--;
    }

    return {
        /**
         * Данный метой является аналогом метода smartOn. По его вызову мы понимаем,
         * какие параметры мы должны передать smartOn, чтобы произошла правильная подписка,
         * соотвествующая семантике метода on, т.е. обработчик может быть вызван сколь
         * угодно раз -> n = inf; он срабатывает на каждый вызов -> whenRep = -1; сколько вызовов
         * было совершено -> currentCall = 0.
         *
         * @param {string} eventName
         * @param {object} student
         * @param {function} callback
         */
        on: function (eventName, student, callback) {
            smartOn(eventName, student, callback, inf, -1, 0);
        },

        /**
         * Данный метод отписывает студента от определённого события.
         * @param {string} eventName
         * @param {object} student
         */
        off: function (eventName, student) {
            if (typeof eventName === 'string' &&
                eventName !== 'undefined' &&
                typeof student === 'object') {
                var index = signedStudents.indexOf(student);
                if (index > -1) {
                    var events = eventName.split('.');
                    /** Если событие является двухуровневым, то простая отписка */
                    if (events.length == 2) {
                        if (eventName in listeners[index]['cbs']) {
                            delete listeners[index]['cbs'][eventName];
                        }
                    } else {
                        /** Если же первого уровня, то мы должны учесть и все вторые */
                        for (var cb in listeners[index]['cbs']) {
                            if (cb.indexOf(eventName) > -1) {
                                delete listeners[index]['cbs'][cb];
                            }
                        }
                    }
                }
            }
        },

        /**
         * Метод вызова события.
         *
         * @param {string} eventName
         */
        emit: function extendedEmit(eventName) {
            if (typeof eventName === 'string' && eventName !== 'undefined') {
                var events = eventName.split('.');
                var oneMoreEv;
                /** Если событие является двухуровневым, то стоит вызвать событие первого уровня */
                if (events.length == 2) {
                    oneMoreEv = events[0];
                }
                /** Вызываем обработчик события для каждого студента, который подписан на него */
                listeners.forEach(function (item) {
                    if (eventName in item['cbs']) {
                        /** Выясняем тип подписки и выполняем её, если она типа 'on' или 'through */
                        if (!isFinite(item['cbs'][eventName][1])) {
                            /** Тип 'through' */
                            if (item['cbs'][eventName][2] != -1) {
                                /** Если настал наш черёд - вызываем */
                                if (item['cbs'][eventName][3] % item['cbs'][eventName][2] == 0) {
                                    smartCall(item, eventName);
                                } else {
                                    /** Иначе учитываем, что нас пытались вызвать */
                                    item['cbs'][eventName][3]++;
                                }
                            } else {
                                /** Тип 'on' */
                                smartCall(item, eventName);
                            }
                        } else {
                            /** Тип 'several'. Вызываем, если ещё имеем право */
                            if (item['cbs'][eventName][1] > 0) {
                                smartCall(item, eventName);
                            }
                        }
                    }
                });
                /** Вызов события первого уровня, если изначальное имело 2 уровня */
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
         * @param {string} eventName
         * @param {object} student
         * @param {function} callback
         * @param {number} n
         */
        several: function (eventName, student, callback, n) {
            smartOn(eventName, student, callback, n, -1, 0);
        },

        /**
         * Данный метой является аналогом метода smartOn. По его вызову мы понимаем,
         * какие параметры мы должны передать smartOn, чтобы произошла правильная подписка,
         * соотвествующая семантике метода through, т.е. обработчик может быть вызван сколь угодно
         * раз -> n = inf; он срабатывает на каждый n-нный вызов -> whenRep = n;
         * сколько вызовов было совершено -> currentCall = 0.
         *
         * @param {string} eventName
         * @param {object} student
         * @param {function} callback
         * @param {number} n
         */
        through: function (eventName, student, callback, n) {
            smartOn(eventName, student, callback, inf, n, 0);
        }
    };
};
