import { readonly } from 'core-decorators';
import { uniqueId } from 'lodash';
import invariant from 'invariant';
import { computed, observable, makeAutoObservable } from 'mobx';
import { BaseModel, hydrateModel, action } from '../model';

const Handlers = observable.map({});
interface ToastAttrs {
    handler: 'scoresPublished'
}

class Toast extends BaseModel {

    @readonly id = uniqueId('toast-');
    @observable handler: any = '';
    @observable status = '';
    @observable type = '';
    @observable info: any = {};

    @computed get isOk() {
        return 'ok' === this.status;
    }

    @computed get component() {
        const handler = Handlers.get(this.handler);
        invariant(handler, `Handler type for '${this.handler}' was not found`);
        return handler(this);
    }
}


const current = observable.array<Toast>()

const Store = makeAutoObservable({
    push(attrs: ToastAttrs) {
        current.push(hydrateModel(Toast, attrs))
    },

    shift() {
        return current.shift()
    },

    get isEmpty() {
        return current.length == 0
    },

}, { shift: action })

const setHandlers = (handlers: any) => {
    Handlers.replace(handlers);
};

export { Store, Toast, setHandlers };
