module.exports = function () {
    return new Lecturer();
};

function Lecturer() {

    var listeners = {};

    var checkType = function (variable, type) {
        if (typeof variable !== type) {
            throw Error('Аргумент должен иметь тип ' + type);
        }
    };

    var getListenerLevel = function (eventName) {
        var events = eventName.split('.');
        var listenerLevel = listeners;
        events.forEach(function (event, number) {
            if (number !== 0) {
                if (listenerLevel.nested === undefined) {
                    listenerLevel.nested = {};
                }
                listenerLevel = listenerLevel.nested;
            }
            if (listenerLevel[event] === undefined) {
                listenerLevel[event] = {};
            }
            listenerLevel = listenerLevel[event];
        });
        if (listenerLevel.listeners === undefined) {
            listenerLevel.listeners = [];
        }
        return listenerLevel;
    };

    this.on = function (eventName, student, callback) {
        checkType(eventName, 'string');
        checkType(student, 'object');
        checkType(callback, 'function');
        getListenerLevel(eventName).listeners.push(new Listener(student, callback));
    };

    this.off = function (eventName, student) {
        checkType(eventName, 'string');
        checkType(student, 'object');
        var listenerLevel = getListenerLevel(eventName);
        listenerLevel.listeners.forEach(function (listener, number) {
            if (listener.student === student) {
                delete listenerLevel.listeners[number];
            }
        });
        if (listenerLevel.nested) {
            Object.keys(listenerLevel.nested).forEach(function (event) {
                this.off(eventName + '.' + event, student);
            }.bind(this));
        }
    };

    this.emit = function (eventName) {
        checkType(eventName, 'string');
        var events = eventName.split('.');
        var listenerLevel = listeners;
        events.forEach(function (event, number) {
            if (number !== 0) {
                if (listenerLevel.nested === undefined) {
                    listenerLevel.nested = {};
                }
                listenerLevel = listenerLevel.nested;
            }
            if (listenerLevel[event] === undefined) {
                listenerLevel[event] = {};
            }
            listenerLevel = listenerLevel[event];
            if (listenerLevel.listeners === undefined) {
                listenerLevel.listeners = [];
            }
            listenerLevel.listeners.forEach(function (listener) {
                listener.callListener();
            });
        });
    };

    this.several = function (eventName, student, callback, n) {
        checkType(eventName, 'string');
        checkType(student, 'object');
        checkType(callback, 'function');
        checkType(n, 'number');
        getListenerLevel(eventName).listeners.push(new Listener(student, callback, n));
    };

    this.through = function (eventName, student, callback, n) {
        checkType(eventName, 'string');
        checkType(student, 'object');
        checkType(callback, 'function');
        checkType(n, 'number');
        getListenerLevel(eventName).listeners.push(new Listener(student, callback, undefined, n));
    };
}


function Listener(student, callback, maxCalls, multiple) {

    this.student = student;
    this.callback = callback;
    this.maxCalls = maxCalls;
    this.multiple = multiple;

    var callCount = 0;

    this.callListener = function () {
        callCount++;
        if ((this.maxCalls && this.maxCalls >= callCount) ||
            (this.multiple && callCount % this.multiple == 0) ||
            (this.maxCalls === undefined && this.multiple === undefined)) {
            this.callback.call(this.student);
        }
    };
}
