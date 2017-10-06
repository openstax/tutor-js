import { observable, computed } from 'mobx';
import { readonly } from 'core-decorators';

export default class ModelApi {

  @readonly requestsInProgress = observable.map();

  @readonly requestCounts = observable({
    read: 0,
    create: 0,
    update: 0,
    delete: 0,
    modify: 0,
  });

  @observable errors = {};

  @computed get isPending() {
    return this.requestsInProgress.size > 0;
  }

  @computed get hasBeenFetched() {
    return Boolean(
      this.requestCounts.read > 0
    );
  }

}
