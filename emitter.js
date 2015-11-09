module.exports = function () {
    return new Emitter();
};

function Emitter() {
    this.students = new Set();
}

Emitter.prototype.addEvent = function (event) {
    event.student.events = event.student.events || {};
    event.student.events[event.name] = event;
    this.students.add(event.student);
};

Emitter.prototype.several = function (eventName, student, callback, n) {
    this.addEvent(new Event(eventName, student, callback, n, true));
};

Emitter.prototype.through = function (eventName, student, callback, n) {
    this.addEvent(new Event(eventName, student, callback, n, false));
};

Emitter.prototype.on = function (eventName, student, callback) {
    this.several(eventName, student, callback, Infinity);
};

Emitter.prototype.off = function (eventName, student) {
    for (var event in student.events) {
        if (event === eventName || event.split('.')[0] === eventName) {
            delete student.events[event];
        }
    }
};

Emitter.prototype.emit = function (eventName) {
    this.students.forEach(student => {
        if (student.events[eventName]) {
            student.events[eventName].emit(this);
        }
        var root = eventName.split('.')[0];
        if (root !== eventName && student.events[root]) {
            student.events[root].emit(this);
        }
    });
};

function Event(name, student, callback, n, endable) {
    this.name = name;
    this.student = student;
    this.callback = callback;
    this.counter = this.n = Math.max(1, n);
    this.endable = endable;
}

Event.prototype.emit = function (emitter) {
    if (this.endable) {
        this.callback.call(this.student);
        if (!--this.counter) {
            emitter.off(this.name, this.student);
        }
    } else if (!--this.counter) {
        this.callback.call(this.student);
        this.counter = this.n;
    }
};
