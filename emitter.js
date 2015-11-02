'use strict';
module.exports = function () {
    var students = new Map();

    function isSubNamespace(ancestor, descendant) {
        var namespacesOfAncestor = ancestor.split('.');
        var namespacesOfDescendant = descendant.split('.');
        if (namespacesOfAncestor.length >= namespacesOfDescendant.length) {
            return false;
        }
        for (var i = 0; i < namespacesOfAncestor.length; i++) {
            if (namespacesOfAncestor[i] != namespacesOfDescendant[i]) {
                return false;
            }
        }
        return true;
    }

    function on(eventName, student, callback, type, n) {
        type = type || 'default';
        n = 0 || n;
        if (!(students.has(student))) {
            students.set(student, {});
            students.get(student).events = {};
        }
        students.get(student).events[eventName] = {
            callback: callback.bind(student),
            type: type,
            n: n,
            counter: n
        };
    }

    function off(eventName, student) {
        students.forEach(value => {
            Object.keys(value.events).forEach(name => {
                if (eventName === name || isSubNamespace(eventName, name)) {
                    delete students.get(student).events[name];
                }
            });
        });
    }

    function emit(eventName) {
        students.forEach(value => {
            Object.keys(value.events).forEach(name => {
                if (eventName === name || isSubNamespace(name, eventName)) {
                    if (value.events[name].type === 'default') {
                        value.events[name].callback();
                    }
                    if (value.events[name].type === 'several' && value.events[name].counter > 0) {
                        value.events[name].callback();
                    }
                    if (value.events[name].type === 'through' && value.events[name].counter === 1) {
                        value.events[name].callback();
                        value.events[name].counter = value.events[name].n + 1;
                    }
                    value.events[name].counter--;
                }
            });
        });
    }

    function several(eventName, student, callback, n) {
        on(eventName, student, callback, 'several', n);
    }

    function through(eventName, student, callback, n) {
        on(eventName, student, callback, 'through', n);
    }

    return {
        on: on,
        off: off,
        emit: emit,
        several: several,
        through: through
    };
};
