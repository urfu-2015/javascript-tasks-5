var NAMESPACE_REGEX = /(.*?)\.(.*)/;

module.exports = function () {
    var namespaces = {};
    return {
        on: function (eventAndNamespace, student, callback) {
            var eventAndNamespaceSplitted = eventAndNamespace.split('.');
            var event = eventAndNamespaceSplitted[0];
            var namespaceString = eventAndNamespaceSplitted.slice(1).join('.');
            var namespace;
            namespaces[namespaceString] = namespaces[namespaceString] || EmitterNamespace();
            namespaces[namespaceString].on(event, student, callback);
        },
        off: function (eventAndNamespace, student) {
            var eventAndNamespaceSplitted = eventAndNamespace.split('.');
            var event = eventAndNamespaceSplitted[0];
            var namespaceString = eventAndNamespaceSplitted.slice(1).join('.');
            var matchedNamespaces;
            if (namespaceString == '') {
                matchedNamespaces = Object.keys(namespaces);
            } else {
                matchedNamespaces = Object.keys(namespaces).filter(function (emitterNamespace) {
                    return emitterNamespace.indexOf(namespaceString) == 0 &&
                    (emitterNamespace.length == namespaceString.length ||
                    emitterNamespace.charAt(namespaceString.length) == '.');
                });
            }
            matchedNamespaces.forEach(function (key) {
                namespaces[key].off(event, student);
            });
        },
        emit: function (eventAndNamespace) {
            var eventAndNamespaceSplitted = eventAndNamespace.split('.');
            var event = eventAndNamespaceSplitted[0];
            var namespaceString = eventAndNamespaceSplitted.slice(1).join('.');
            Object.keys(namespaces).filter(function (emitterNamespace) {
                return namespaceString.indexOf(emitterNamespace) == 0 &&
                (emitterNamespace.length == namespaceString.length ||
                namespaceString.charAt(emitterNamespace.length) == '.' ||
                emitterNamespace.length == 0);
            }).forEach(function (key) {
                namespaces[key].emit(event);
            });
        },
        several: function (eventAndNamespace, student, callback, n) {
            var eventAndNamespaceSplitted = eventAndNamespace.split('.');
            var event = eventAndNamespaceSplitted[0];
            var namespaceString = eventAndNamespaceSplitted.slice(1).join('.');
            var namespace;
            namespaces[namespaceString] = namespaces[namespaceString] || EmitterNamespace();
            namespaces[namespaceString].several(event, student, callback, n);
        },
        through: function (eventAndNamespace, student, callback, n) {
            var eventAndNamespaceSplitted = eventAndNamespace.split('.');
            var event = eventAndNamespaceSplitted[0];
            var namespaceString = eventAndNamespaceSplitted.slice(1).join('.');
            var namespace;
            namespaces[namespaceString] = namespaces[namespaceString] || EmitterNamespace();
            namespaces[namespaceString].through(event, student, callback, n);
        }
    };
};

var EmitterNamespace = function () {
    var handlers = {};
    var __addHandler = function (eventName, student, handler) {
        if (handlers[eventName] === undefined) {
            handlers[eventName] = new ObjectKeyMap();
        }
        if (handlers[eventName].get(student) === undefined) {
            handlers[eventName].add(student, []);
        }
        handlers[eventName].get(student).push(handler);
    };
    return {
        on: function (eventName, student, callback) {
            __addHandler(eventName, student, {
                type: 'every',
                cb: callback.bind(student)
            });
        },

        off: function (eventName, student) {
            if (handlers[eventName] !== undefined &&
            handlers[eventName].get(student) !== undefined) {
                handlers[eventName].remove(student);
            }
        },

        emit: function (eventName) {
            if (handlers[eventName] !== undefined) {
                handlers[eventName].getAllValues().forEach(function (handlersArray) {
                    for (var i = 0; i < handlersArray.length; i++) {
                        var handler = handlersArray[i];
                        if (handler.type == 'every') {
                            handler.cb();
                        }
                        if (handler.type == 'several') {
                            handler.currentTimesCount++;
                            if (handler.currentTimesCount > handler.timesCount) {
                                handlersArray.splice(i, 1);
                                i--;
                            } else {
                                handler.cb();
                            }
                        }
                        if (handler.type == 'through') {
                            handler.currentTimesCount++;
                            if (handler.currentTimesCount == handler.timesCount) {
                                handler.cb();
                                handler.currentTimesCount = 0;
                            }
                        }
                    };
                });
            }
        },

        several: function (eventName, student, callback, n) {
            __addHandler(eventName, student, {
                type: 'several',
                cb: callback.bind(student),
                timesCount: n,
                currentTimesCount: 0
            });
        },

        through: function (eventName, student, callback, n) {
            __addHandler(eventName, student, {
                type: 'through',
                cb: callback.bind(student),
                timesCount: n,
                currentTimesCount: 0
            });
        }
    };
};

var ObjectKeyMap = function () {
    this.__keys = [];
    this.__values = [];
};

ObjectKeyMap.prototype.add = function (key, value) {
    var index = this.__keys.indexOf(key);
    if (index == -1) {
        this.__keys.push(key);
        this.__values.push(value);
    } else {
        this.__values[index] = value;
    }
};

ObjectKeyMap.prototype.remove = function (key) {
    var index = this.__keys.indexOf(key);
    if (index != -1) {
        this.__keys.splice(index, 1);
        this.__values.splice(index, 1);
    }
};

ObjectKeyMap.prototype.get = function (key) {
    var index = this.__keys.indexOf(key);
    if (index == -1) {
        return undefined;
    }
    return this.__values[index];
};

ObjectKeyMap.prototype.getAllValues = function () {
    return this.__values;
};


