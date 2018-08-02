import { last, map, filter, find, reduce } from 'lodash';
import { computed, action, observable } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from 'shared/model';

import SharedExercise from 'shared/model/exercise';

@identifiedBy('exercises/exercise')
export default class Exercise extends SharedExercise {

  @session error;

  @action onError({ message }) {
    this.error = message;
  }
}
