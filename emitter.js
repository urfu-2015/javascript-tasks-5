module.exports = function () {
    return new Lecturer();
};

function Lecturer() {

    this._listeners = {};

}

Lecturer.prototype._checkPositiveNumber = function (variable) {
    if (typeof variable !== 'number' || variable <= 0) {
        throw new RangeError('Аргумент должен быть положительным числом');
    }
};

Lecturer.prototype._checkObject = function (variable) {
    if (variable === null || typeof variable !== 'object') {
        throw new TypeError('Аргумент должен быть объектом');
    }
};

Lecturer.prototype._checkFunction = function (variable) {
    if (typeof variable !== 'function') {
        throw new TypeError('Аргумент должен быть функцией');
    }
};

Lecturer.prototype._checkNonEmptyString = function (variable) {
    if (typeof variable !== 'string' || variable.length === 0) {
        throw new TypeError('Аргумент должен быть непустой строкой');
    }
};

Lecturer.prototype._getListenersForEvent = function (eventName) {
    var listeners = this._listeners[eventName];
    if (listeners === undefined) {
        listeners = this._listeners[eventName] = [];
    }
    return listeners;
};

Lecturer.prototype.on = function (eventName, student, callback) {
    this._checkNonEmptyString(eventName);
    this._checkObject(student);
    this._checkFunction(callback);
    this._getListenersForEvent(eventName).push(new Listener(student, callback));
};

Lecturer.prototype.off = function (eventName, student) {
    this._checkNonEmptyString(eventName);
    this._checkObject(student);
    Object.keys(this._listeners).forEach(function (event) {
        if (event === eventName || event.indexOf(eventName + '.') === 0) {
            this._listeners[event] = this._listeners[event].filter(function (listener) {
                return listener.getStudent() !== student;
            });
        }
    }, this);
};

Lecturer.prototype.emit = function (eventName) {
    var lastDotIdx = eventName.lastIndexOf('.');
    if (lastDotIdx >= 0) {
        this.emit(eventName.substring(0, lastDotIdx));
    }
    this._getListenersForEvent(eventName).forEach(function (listener) {
        listener.callListener();
    });
};

Lecturer.prototype.several = function (eventName, student, callback, n) {
    this._checkNonEmptyString(eventName);
    this._checkObject(student);
    this._checkFunction(callback);
    this._checkPositiveNumber(n);
    this._getListenersForEvent(eventName).push(new Listener(student, callback, n));
};

Lecturer.prototype.through = function (eventName, student, callback, n) {
    this._checkNonEmptyString(eventName);
    this._checkObject(student);
    this._checkFunction(callback);
    this._checkPositiveNumber(n);
    this._getListenersForEvent(eventName).push(new Listener(student, callback, undefined, n));
};


function Listener(student, callback, maxCalls, multiple) {

    this._student = student;
    this._callback = callback;
    this._maxCalls = maxCalls;
    this._multiple = multiple;
    this._callCount = 0;

}

Listener.prototype.callListener = function () {
    this._callCount++;
    if ((this._maxCalls && this._maxCalls >= this._callCount) ||
        (this._multiple && this._callCount % this._multiple === 0) ||
        (this._maxCalls === undefined && this._multiple === undefined)) {
        this._callback.call(this._student);
    }
};

Listener.prototype.getStudent = function () {
    return this._student;
};
