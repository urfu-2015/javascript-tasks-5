function getElem(element, index, arrays) {
    console.log(element == this);
    return (element == this);
}

module.exports = function () {
    return {
        students: [],
        on: function (eventLayers, studentWithEvent, callback) {
            eventLayers = eventLayers.split('.');
            var elem = this.students.find(getElem, studentWithEvent);
            var currentLayer = studentWithEvent;
            for (var i in eventLayers.slice(0, eventLayers.length)) {
                if (currentLayer[eventLayers[i]] === undefined) {
                    currentLayer[eventLayers[i]] = {action: undefined};
                }
                currentLayer = currentLayer[eventLayers[i]];
            }
            currentLayer['action'] = callback;
            if (elem == undefined) {
                this.students.push(studentWithEvent);
            }
        },

        off: function (eventLayers, student) {
            var elem = this.students.find(getElem, student);

            eventLayers = eventLayers.split('.');
            var currentLayer = elem;
            for (var i in eventLayers.slice(0, eventLayers.length - 1)) {
                currentLayer = currentLayer[eventLayers[i]];
            }
            delete currentLayer[eventLayers[eventLayers.length - 1]];
        },

        emit: function (eventName) {
            var eventLayers = eventName.split('.');
            for (var index in this.students) {
                var currentLayer = this.students[index];
                var stackOfFunctions = [];
                for (var i = 0; i < eventLayers.length; i++) {
                    if (currentLayer[eventLayers[i]] === undefined) {
                        break;
                    }
                    var action = currentLayer[eventLayers[i]].action;
                    if (action !== undefined) {
                        action.call(this.students[index]);
                    }
                    currentLayer = currentLayer[eventLayers[i]];
                }

            }

        },

        several: function (eventName, student, callback, n) {
        },

        through: function (eventName, student, callback, n) {

        }
    };
};
