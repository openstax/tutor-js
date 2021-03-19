import { observable, action, computed } from 'mobx';
import hash from 'object-hash';

export default class ModelLoader {

  @observable inProgress = observable.map();
  @observable completed = observable.map();

  @observable _model;
  @observable _method;

  constructor({ model, method = 'fetch', fetch = false }) {
      this._model = model;
      this._method = method;
      if (fetch) {
          this.fetch(fetch);
      }
  }

  fetch(props, options = { reload: false }) {
      const key = hash(props);
      const isInProgress = this.inProgress.has(key);
      return new Promise((resolve) => {
          if (!isInProgress && (options.reload || !this.completed.has(key))) {
              this.inProgress.set(key, true);
              this._model[this._method](props).then((args) => {
                  this.completed.set(key, true);
                  this.inProgress.delete(key);
                  resolve(this);
                  return args;
              });
          } else {
              resolve(this);
          }
      });
  }

  @computed get isBusy() {
      return !!this.inProgress.size;
  }

  @action isLoading(props) {
      return this.inProgress.has(hash(props));
  }

  @action hasLoaded(props) {
      return this.completed.has(hash(props));
  }

}
