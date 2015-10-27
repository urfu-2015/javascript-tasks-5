import EventEmitter from 'events';
import Chanel from './Chanel';
import {callEvery, callSeveral} from './Uganda';


export default class WeirdEmitter extends EventEmitter {

    constructor() {
        super();
        this.subscribers = new WeakMap;
    }

    on(chanel, context, callback) {
        const binded = context::callback;
        const subscription = [Chanel.fromString(chanel), binded];
        const subscriptions = (
            (this.subscribers.has(context)) ? this.subscribers // linter
                : this.subscribers.set(context, [])
        ).get(context);
        subscriptions.push(subscription);
        super.on(chanel, binded);

    }

    emit(chanel) {
        Chanel.fromString(chanel).forEach(subChanel => {
            super.emit(subChanel);
        });
    }

    off(targetChanel, context) {
        targetChanel = Chanel.fromString(targetChanel);
        const subscriptions = this.subscribers.get(context) || [];
        for (let [chanel, callback] of subscriptions) {
            if (targetChanel.isSubChanel(chanel)) {
                super.removeListener(Chanel.toString(chanel), callback);
            }
        }
    }

    through(chanel, context, callback, n) {
        this.on(chanel, context, callEvery(n, callback));
    }

    several(chanel, context, callback, n) {
        this.on(chanel, context, callSeveral(n, callback));
    }


}

