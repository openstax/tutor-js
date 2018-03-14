import { last, map, filter, find, reduce } from 'lodash';
import { computed, action, observable } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from 'shared/model';

import SharedExercise from 'shared/model/exercise';

@identifiedBy('exercises/exercise')
export default class Exercise extends SharedExercise {

  @computed get isNew() {
    return this.id === 'new';
  }

  publish() {

  }

  saveDraft() {
    const req = { data: this.serialize() };
    if (this.isNew) {
      Object.assign(req, { url: 'exercises', method: 'POST' });
    }
    return req;
  }

  onSaved({ data }) {
    debugger
    this.update(data)
  }

}
