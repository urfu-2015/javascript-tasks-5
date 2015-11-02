module.exports = function () {
    return new Emitter();
};

function Emitter() {
    this.events = {};
}

Emitter.prototype.on = function on(eventName, student, callback) {
    this._addEvent(eventName, student, callback, Infinity, 'each');
};

Emitter.prototype.off = function off(eventName, student) {
    var foundInfo = [];
    while (foundInfo = this._findStudent(eventName, student)) {
        this.events[foundInfo[1]].splice(foundInfo[0], 1);
    }
};

Emitter.prototype.emit = function emit(eventName) {
    var events = eventName.split('.');
    var emitEvent = '';
    for (var i = 0; i < events.length; ++i) {
        emitEvent += events[i];
        this.events[emitEvent].forEach(function (item) {
            if (item.type === 'each') {
                if (item.counter < item.n) {
                    item.callback.call(item.student);
                    ++item.counter;
                }
            } else if (item.type === 'step') {
                if (item.counter % item.n === 0) {
                    item.callback.call(item.student);
                }
                ++item.counter;
            }
        });
        emitEvent += '.';
    }
};

Emitter.prototype.several = function several(eventName, student, callback, n) {
    this._addEvent(eventName, student, callback, n, 'each');
};

Emitter.prototype.through = function through(eventName, student, callback, n) {
    this._addEvent(eventName, student, callback, n, 'step');
};

Emitter.prototype._addEvent =
    function _addEvent(eventName, student, callback, n, type) {
        var tmpEvents = Object.keys(this.events);
        if (tmpEvents.indexOf(eventName) < 0) {
            this.events[eventName] = [];
        }
        if (this._findStudent(eventName, student)) {
            console.error('Ошибка! Данный студент уже изучает эту дисциплину!');
            return;
        }
        this.events[eventName].push(new Student(student, callback, type, n));
    };

Emitter.prototype._findStudent = function _findStudent(eventName, student) {
    for (var event in this.events) {
        if (this.events.hasOwnProperty(event)) {
            if (event.indexOf(eventName) >= 0) {
                if (this.events[event]) {
                    var students = this.events[event];
                    var length = this.events[event].length;
                    for (var i = 0; i < length; ++i) {
                        if (this.events[event][i].student === student) {
                            return [i, event];
                        }
                    }
                }
            }
        }
    }
};

function Student(student, callback, type, n) {
    this.student = student;
    this.callback = callback;
    this.type = type;
    this.n = n;
    this.counter = 0;
}
