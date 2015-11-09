var getEmitter = require('./emitter');
var lecturer = getEmitter();

var daria = {
    count: 0
};
var pyotr = {
    count: 0
};
var anna = {
    count: 0
};
var semen = {
    count: 0
};

lecturer.through('slide.text', daria, function () {
    this.count++;
    console.log(this.count, 'through Daria');
}, 2);

lecturer.through('slide.text', pyotr, function () {
    this.count++;
    console.log(this.count, 'through Pyotr');
}, 3);

lecturer.on('slide.text', anna, function () {
    this.count++;
    console.log(this.count, 'on Anna');
});

lecturer.several('slide', semen, function () {
    this.count++;
    console.log(this.count, 'several Semen');
}, 5);

for (var i = 1; i <= 8; i++) {
    console.log('\nSlide #' + i);
    lecturer.emit('slide.text');
    if (i == 7) {
        lecturer.off('slide', anna);
    }
}
