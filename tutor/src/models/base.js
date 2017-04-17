// will eventually hook into data loading/saving using the
// derived model's identifiedBy strings

import { observable, computed } from 'mobx';
import { find, isNil } from 'lodash';
import { session } from 'mobx-decorated-models';

export class BaseModel {

  constructor(attrs) {
    if (attrs) { this.update(attrs); }
  }

  apiRequestsInProgress = observable.map();

  @computed get isNew() {
    const idField = find(this.constructor.$schema.values(), { type: 'identifier' });
    return isNil(this[idField.name]);
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
