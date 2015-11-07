'use strict';

var getEmitter = require('./emitter');
var lecturer = getEmitter();

var daria = {
    focus: 5,
    wisdom: 1
};

lecturer.on('begin', daria, function () {
    this.focus += 2;
    console.log('daria begin');
});

lecturer.on('slide', daria, function () {
    this.wisdom += this.focus * 0.25;
    this.focus += 1;
    console.log('daria slide');
});

var iakov = {
    focus: 5,
    wisdom: 1
};

lecturer.on('begin', iakov, function () {
    this.wisdom = 0;
    console.log('iakov begin');
});

lecturer.on('slide', iakov, function () {
    this.wisdom += this.focus * 0.5;
    this.focus -= 2;
    console.log('iakov slide');
});

lecturer.on('slide.funny', iakov, function () {
    this.focus += 5;
    console.log('iakov slide.funny');
});

var pyotr = {
    focus: 5,
    wisdom: 1
};

lecturer.on('begin', pyotr, function () {
    this.wisdom = 3;
    this.focus = 10;
    console.log('pyotr begin');
});

lecturer.on('slide', pyotr, function () {
    this.wisdom += this.focus * 0.1;
    console.log('pyotr slide');
});

lecturer.through('slide.text', pyotr, function () {
    this.focus -= 3;
    console.log('pyotr slide.text');
}, 2);

var roma = {
    focus: 5,
    wisdom: 1
};

lecturer.on('slide', roma, function () {
    this.wisdom += 1 + this.focus * 0.5;
    this.focus -= 2;
    console.log('roma slide');
});

lecturer.several('slide.funny', roma, function () {
    this.focus += 1;
    console.log('roma slide.funny');
}, 5);

// начинаем лекцию

lecturer.emit('begin');
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('slide.funny');
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('slide.funny');
console.log('--------------------------------------');

lecturer.off('slide.funny', iakov);
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('slide.funny');
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('slide.funny');
console.log('--------------------------------------');

lecturer.off('slide', roma);
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('slide.text');
console.log('--------------------------------------');

lecturer.emit('end');
