module.exports = function () {

	var students = [];

    return {
        on: function (eventName, student, callback) {
        	if (!student.events) {
   		    	student.events = {};
   		    }
        	student.events[eventName] = callback;
        	students.push(student);
        },

        off: function (eventName, student) {
        	for (event in student.events) {
        		if (eventName === event || eventName === event.split('.')[0]){
        			delete student.events[event];
        		}
        	}
        },

        emit: function (eventName) {
        	students.forEach(student => {
	        	if (student.events[eventName]) {
	            	student.events[eventName].call(student);
	        	}
	        	var mainEvent = eventName.split('.')[0];
	        	if (mainEvent !== eventName && student.events[mainEvent]) {
	            	student.events[mainEvent].call(student);
	        	}
   			});
        },

        several: function (eventName, student, callback, n) {

        },

        through: function (eventName, student, callback, n) {

        }
    };
};
