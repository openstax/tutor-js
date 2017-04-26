// will eventually hook into data loading/saving using the
// derived model's identifiedBy strings

import { observable, computed } from 'mobx';
import { find, isNil } from 'lodash';
import { session } from 'mobx-decorated-models';

const FLUX_NEW = /_CREATING_/;

export class BaseModel {

  constructor(attrs) {
    if (attrs) { this.update(attrs); }
  }

  apiRequestsInProgress = observable.map();

  @computed get hasApiRequestPending() {
    return !!this.apiRequestsInProgress.size;
  }

  @computed get isNew() {
    const idField = find(this.constructor.$schema.values(), { type: 'identifier' });
    const id = this[idField.name];
    return isNil(id) || FLUX_NEW.test(id);
  }

  loaded(req) {
    this.update(req.data);
  }
}

// export decorators so they can be easily imported into model classes
export {
  identifiedBy, identifier, hasMany, belongsTo, field, session,
} from 'mobx-decorated-models';

export {
  computed,
  observable,
} from 'mobx';
