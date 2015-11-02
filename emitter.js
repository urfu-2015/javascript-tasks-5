var NAMESPACE_REGEX = /(.*?)\.(.*)/;

module.exports = function () {
    var globalNamespace = EmitterNamespace();
    var namespaces = {};
    var __getEventAndNamespace = function (combinedString) {
        var match = NAMESPACE_REGEX.exec(combinedString);
        if (match === null) {
            return [combinedString, null];
        }
        return [match[1], match[2]];
    };
    var __makeActionOnNamespace = function (combinedEventString, action, args) {
        var eventAndNamespace = __getEventAndNamespace(combinedEventString);
        var namespace;
        if (eventAndNamespace[1] == null) {
            namespace = globalNamespace;
        } else {
            if (namespaces[eventAndNamespace[1]] === undefined) {
                namespaces[eventAndNamespace[1]] = EmitterNamespace();
            }
            namespace = namespaces[eventAndNamespace[1]];
        }
        args[0] = eventAndNamespace[0];
        namespace[action].apply(namespace, args);
    };
    return {
        on: function (combinedEventString) {
            __makeActionOnNamespace(combinedEventString, 'on', [].slice.call(arguments));
        },
        off: function (combinedEventString, student) {
            var eventAndNamespace = __getEventAndNamespace(combinedEventString);
            if (eventAndNamespace[1] !== null) {
                if (namespaces[eventAndNamespace[1]] !== undefined) {
                    namespaces[eventAndNamespace[1]].off(eventAndNamespace[0], student);
                }
                return;
            }
            globalNamespace.off(eventAndNamespace[0], student);
            Object.keys(namespaces).forEach(function (namespaceName) {
                namespaces[namespaceName].off(eventAndNamespace[0], student);
            });
        },
        several: function (combinedEventString) {
            __makeActionOnNamespace(combinedEventString, 'several', [].slice.call(arguments));
        },
        through: function (combinedEventString) {
            __makeActionOnNamespace(combinedEventString, 'through', [].slice.call(arguments));
        },
        emit: function (eventName) {
            var eventAndNamespace = __getEventAndNamespace(eventName);
            globalNamespace.emit(eventAndNamespace[0]);
            if (eventAndNamespace[1] !== null && namespaces[eventAndNamespace[1]] !== undefined) {
                namespaces[eventAndNamespace[1]].emit(eventAndNamespace[0]);
            }
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


