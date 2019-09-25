// will eventually hook into data loading/saving using the
// derived model's identifiedBy strings
import { computed, action } from 'mobx';
import { find, isNil, get } from 'lodash';
import { getSchema } from 'mobx-decorated-models';
const FLUX_NEW = /_CREATING_/;
import lazyGetter from './helpers/lazy-getter.js';
import ModelApi from './model/api';
import './model/types';

export class BaseModel {

  constructor(attrs) {
    if (attrs) { this.update(attrs); }
  }

  @lazyGetter api = new ModelApi();

  @computed get isNew() {
    const schema = getSchema(this.constructor);
    const idField = find(Array.from(schema.properties.values()), { type: 'identifier' });
    if (!idField) {
      return false;
    }
    const id = this[idField.name];
    return isNil(id) || FLUX_NEW.test(id);
  }

  @action ensureLoaded() {
    if (!this.api.isPending && !this.api.hasBeenFetched) {
      return this.fetch();
    }
    return Promise.resolve();
  }

  @action onApiRequestComplete({ data }) {
    this.api.errors = {};
    this.update(data);
  }

  @action
  setApiErrors(error) {
    error.isRecorded = true;
    const errors = get(error, 'response.data.errors');
    if (errors) {
      this.api.errors = {};
      errors.forEach(e => this.api.errors[e.code] = e);
    } else if (error) {
      this.api.errors = { error: error.toString() };
    } else {
      this.api.errors = {};
    }
    this.api.errors.last = error;
  }

}

// export decorators so they can be easily imported into model classes
export {
  identifiedBy, identifier, hasMany, belongsTo, field, session,
} from 'mobx-decorated-models';

export {
  computed,
  observable,
  action,
} from 'mobx';
