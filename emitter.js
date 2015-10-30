module.exports = function () {
    return new Emmiter();
};

function Emmiter() {
    this.students = new Set();
}

Emmiter.prototype.on = function (eventName, student, callback) {
    if (!student.events) {
        student.events = {};
    }
    student.events[eventName] = callback;
    this.students.add(student);
};

Emmiter.prototype.off = function (eventName, student) {
    for (event in student.events) {
        if (event === eventName || event.split('.')[0] === eventName) {
            delete student.events[event];
        }
    }
};

Emmiter.prototype.emit = function (eventName) {
    this.students.forEach(student => {
        if (student.events[eventName]) {
            student.events[eventName].call(student);
        }
        var root = eventName.split('.')[0];
        if (root !== eventName && student.events[root]) {
            student.events[root].call(student);
        }
    });
};

Emmiter.prototype.several = function (eventName, student, callback, n) {

};

Emmiter.prototype.through = function (eventName, student, callback, n) {

};
