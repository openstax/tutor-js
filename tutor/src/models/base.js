import { pick, assign } from 'lodash';

// will eventually hook into data loading/saving using the
// derived model's identifiedBy strings
export class BaseModel {

  constructor(attrs) {
    if (attrs) { this.update(attrs); }
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
