import {
  BaseModel, identifiedBy, observable, computed,
} from '../../model';
import { first, last } from 'lodash';

@identifiedBy('exercise/tag')
export default class ExerciseTag extends BaseModel {

  @observable _tag;
  @observable is_visible = true;

  constructor(tag) {
    super();
    this._tag = tag;
  }

  serialize() {
    return this.asString;
  }

  @computed get name() {
    return this.asString;
  }

  @computed get asString() {
    return this._tag || '';
  }

  @computed get parts() {
    return this.asString.split(':');
  }

  @computed get type() {
    return first(this.parts);
  }

  @computed get value() {
    return last(this.parts);
  }
}
