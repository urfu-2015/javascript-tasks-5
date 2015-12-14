module.exports = function () {
    var students = [];
	var index = 0;
	var currentEvent;
	
    var willDelete = function (Target, Array) {
	    var answer = true;
        if (Array.length < Target.length) {
            answer = false;
        } else {
            for (var i = 0; i < Target.length; i++) {
                if (Target[i] != Array[i]) {
                    answer = false;
                    break;
                }
            }
        }
        return answer;
    };
    return {
        index, 
        students: [],
        on: function (eventName, student, callback) {
            var studentActive = {name: student, event: eventName, callback: callback};
            this.students.push(studentActive);
        },

        off: function (eventName, student) {
            var eventList = eventName.split('.');
            for (var i = 0; i < this.students.length; i++) {
                var studenEventList = (this.students[i].event).split('.'); 
                if (willDelete(eventList, studenEventList) && (this.students[i].name === student)) {
                    this.students.splice(i,1);
                    i--;
                }
            }
        },

        emit: function (eventName) {
            var eventList = eventName.split('.');	
            for (var i = 1; i < eventList.length; i++) {
                eventList[i] = eventList[i - 1] + '.' + eventList[i];
            }
            for (var i = 0; i < eventList.length; i++) {
                for (var j = 0; j < this.students.length; j++) {
                    if (eventList[i] === this.students[j].event) {
                        this.students[j].callback.call(this.students[j].name);
                    } 
                }
            }
        }

        /*several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }*/
    };
};
