module.exports = function () {
    var students = [];
	var index = 0;
	var currentEvent;
	return {
	    index, 
	    students: [],
        on: function (eventName, student, callback) {
            var studentActive = {name: student, event: eventName, callback: callback};
			this.students.push(studentActive);
        },

        off: function (eventName, student) {
            for (var i = 0; i < this.students.length; i++) {
			    if ((this.students[i].event).indexOf(eventName) != -1 && (this.students[i].name === student)) {
				    this.students.splice(i,1);
					i--;
				}
			}
		},

        emit: function (eventName) {
            this.students.forEach(function(student) {
			    if (eventName.indexOf(student.event) != -1) {
				    student.callback.call(student);
				}
			});			
        }

        /*several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }*/
    };
};
