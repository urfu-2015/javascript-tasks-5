'use strict';

var getEmitter = require('./emitter');
var lecturer = getEmitter();

var daria = {
    focus: 5,
    wisdom: 1
};

lecturer.on('slide', daria, function () {
    console.log('Новый слайд!');
});

lecturer.on('slide.funny', daria, function () {
    console.log('Новый смешной слайд!');
});

// lecturer.off('slide', daria);

lecturer.emit('slide'); // 'Новый слайд!'
lecturer.emit('slide.funny.cat'); // 'Новый смешной слайд!'
lecturer.emit('slide.text'); // 'Новый
