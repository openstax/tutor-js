import { observable, action, computed, modelize } from 'shared/model'
import hash from 'object-hash'

export class ModelLoader {

    @observable inProgress = observable.map();
    @observable completed = observable.map();

    @observable _model: any;
    @observable _method;

    constructor({ model, method = 'fetch', fetch = false }: { model: any, method?: string, fetch?: any }) {
        modelize(this);
        this._model = model;
        this._method = method;
        if (fetch) {
            this.fetch(fetch);
        }
    }

    fetch(props: any, options = { reload: false }) {
        const key = hash(props);
        const isInProgress = this.inProgress.has(key);
        return new Promise<void>(action((resolve) => {
            if (!isInProgress && (options.reload || !this.completed.has(key))) {
                this.inProgress.set(key, true);
                this._model[this._method](props).then(action((args: any) => {
                    this.completed.set(key, true);
                    this.inProgress.delete(key);
                    resolve();
                    return args;
                }));
            } else {
                resolve();
            }
        }));
    }

    @computed get isBusy() {
        return !!this.inProgress.size;
    }

    @action isLoading(props: any) {
        return this.inProgress.has(hash(props));
    }

    @action hasLoaded(props: any) {
        return this.completed.has(hash(props));
    }

}
