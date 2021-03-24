import { readonly } from 'core-decorators';
import { uniqueId } from 'lodash';
import invariant from 'invariant';
import { computed, observable } from 'mobx';
import { BaseModel } from '../model';

const Handlers = observable.map({});

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


const Store = observable.array<Toast>()

const setHandlers = (handlers: any) => {
    Handlers.replace(handlers);
};

export { Store, Toast, setHandlers };
