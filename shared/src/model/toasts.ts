import { readonly } from 'core-decorators';
import { uniqueId } from 'lodash';
import invariant from 'invariant';
import { computed, observable } from 'mobx';
import { BaseModel, array, hydrateModel } from '../model';

const Handlers = observable.map({});
interface ToastAttrs {
    info?:any
    type?: string
    status?: string
    errors?: any
    handler: 'scoresPublished' | 'reload' | 'job'
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


const Store = array( (current: Toast[]) => ({

    add(attrs: ToastAttrs) {
        current.push(hydrateModel(Toast, attrs, current))
    },

    get isEmpty() {
        return current.length == 0
    },

}))
//                           , { shift: action })

const setHandlers = (handlers: any) => {
    Handlers.replace(handlers);
};

export { Store, Toast, setHandlers };
