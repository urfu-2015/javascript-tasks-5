module.exports = function () {
    return {
        students: [],
        on: function (eventName, student, callback) {
            var eventLayers = eventName.split('.');
            var studentWithEvent = student;
            var isNewStudent = this.students.indexOf(student);
            var currentLayer = studentWithEvent;
            for (var i in eventLayers) {
                if (currentLayer[eventLayers[i]] === undefined) {
                    currentLayer[eventLayers[i]] = {};
                }
                currentLayer = currentLayer[eventLayers[i]];
            }
            currentLayer['action'] = callback;
            if (isNewStudent == -1) {
                this.students.push(studentWithEvent);
            }
        },

        off: function (eventName, student) {
            var indexCurrentStudents = this.students.indexOf(student);
            var eventLayers = eventName.split('.');
            var currentLayer = this.students[indexCurrentStudents];
            for (var i = 0; i < eventLayers.length - 1; i++) {
                currentLayer = currentLayer[eventLayers[i]];
            }
            delete currentLayer[eventLayers[eventLayers.length - 1]];
            console.log(this.students);
        },

        emit: function (eventName) {
            console.log(eventName, 'event');
            var eventLayers = eventName.split('.');
            for (var index in this.students) {
                var currentLayer = this.students[index];
                var stackOfFunctions = [];
                for (var i = 0; i < eventLayers.length; i++) {
                    if (currentLayer[eventLayers[i]] === undefined) {
                        break;
                    }
                    var action = currentLayer[eventLayers[i]].action;
                    var bindedAction = action.bind(this.students[index]);
                    bindedAction();
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
