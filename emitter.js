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
    var foundInfo = this._deepFind(eventName, student);
    foundInfo.forEach(function (info) {
        this.events[info[1]].splice(info[0], 1);
    }, this);
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
                if (item.counter !== 0 && item.counter % item.n === 0) {
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
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        if (this._find(eventName, student)) {
            console.error('Ошибка! Данный студент уже изучает эту дисциплину!');
            return;
        }
        this.events[eventName].push({
            student: student,
            callback: callback,
            type: type,
            n: n,
            counter: 0
        });
    };

Emitter.prototype._find = function _find(eventName, student) {
    if (this.events[eventName]) {
        var students = this.events[eventName];
        var length = this.events[eventName].length;
        for (var i = 0; i < length; ++i) {
            if (this.events[eventName][i].student === student) {
                return [i, eventName];
            }
        }
    }
};

Emitter.prototype._deepFind = function _deepFind(eventName, student) {
    var result = [];
    for (var event in this.events) {
        if (this.events.hasOwnProperty(event)) {
            if (event.indexOf(eventName) >= 0) {
                var temp = [];
                if (temp = this._find(event, student)) {
                    result.push(temp);
                }
            }
        }
    }
    return result;
};
