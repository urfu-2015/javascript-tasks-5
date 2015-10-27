const SEPARATOR = '.';

export default class Chanel {

    constructor(arr) {
        this._path = [...arr];
    }

    isSubChanel(chanel) {
        return this._path.every((v,i) => v == chanel._path[i]);
    }

    forEach(callback) {
        this._path.reduce((mem,value) => {
            mem = mem != null ? [mem,value].join(SEPARATOR) : value;
            callback(mem);
            return mem;
        }, null);
    }

    static fromString(str) {
        return new Chanel(str.split(SEPARATOR));
    }

    static toString(chanel) {
        return chanel._path.join(SEPARATOR);
    }
}
