import { readonly } from 'core-decorators';
import { createCollection } from 'mobx-decorated-models';
import { uniqueId } from 'lodash';
import invariant from 'invariant';
import { computed, observable } from 'mobx';
import {
    BaseModel, identifiedBy, session,
} from '../model';

const Handlers = observable.map({});

@identifiedBy('toast')
class Toast extends BaseModel {

  @readonly id = uniqueId('toast-');
  @session handler;
  @session status;
  @session type;
  @session({ type: 'object' }) info;

  @computed get isOk() {
      return 'ok' === this.status;
  }

  @computed get component() {
      const handler = Handlers.get(this.handler);
      invariant(handler, `Handler type for '${this.handler}' was not found`);
      return handler(this);
  }
}


const Store = createCollection({ model: Toast });

const setHandlers = (handlers) => {
    Handlers.replace(handlers);
};

export { Store, Toast, setHandlers };
