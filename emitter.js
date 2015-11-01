module.exports = function () {
    return new Emitter();
};

function Emitter() {
    this.students = new Set();
}

Emitter.prototype.createEvent = function (eventName, student, callback, endable, n) {
    if (!student.events) {
        student.events = {};
    }
    student.events[eventName] = new Event(eventName, student, callback, endable, n);
    this.students.add(student);
};

Emitter.prototype.several = function (eventName, student, callback, n) {
    this.createEvent(eventName, student, callback, true, n);
};

Emitter.prototype.through = function (eventName, student, callback, n) {
    this.createEvent(eventName, student, callback, false, n);
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

function Event(name, student, callback, endable, n) {
    this.name = name;
    this.student = student;
    this.callback = callback;
    this.endable = endable;
    this.n = n;
    this.counter = this.n;
}

Event.prototype.emit = function (emitter) {
    this.callback.call(this.student);
    if (--this.counter) {
        return;
    }
    if (this.endable) {
        emitter.off(this.name, this.student);
    } else {
        this.counter = this.n;
    }
};
