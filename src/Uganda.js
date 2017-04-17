/**
 * Created by Kirill on 10/27/2015.
 */
export function callEvery(n, fn) {
    let calls = 0;
    return function (...args) {
        return calls++ % n ? null : this::fn(...args);
    };
}

export function callSeveral(n, fn) {
    return function (...args) {
        for (let i = 0; i < n; i++) {
            this::fn(...args);
        }
    };
}
