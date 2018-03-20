import {
  BaseModel, identifiedBy, observable, computed, action,
} from '../../model';
import { isObject, first, last, filter, extend, values, pick, isNil } from 'lodash';

@identifiedBy('exercise/tag')
export default class ExerciseTag extends BaseModel {

  @observable _tag;
  @observable is_visible = true;

  constructor(tag) {
    super();
    if (isObject(tag)) {
      this.setParts(tag);
    } else {
      this._tag = tag;
    }
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

  @computed get asObject() {
    return pick(this, 'type', 'specifier', 'value');
  }

  @computed get parts() {
    return this.asString.split(':');
  }

  @computed get type() {
    return first(this.parts);
  }

  set type(type) {
    this.setParts({ type });
  }

  @computed get specifier() {
    return this.parts.length == 3 ? this.parts[1] : null;
  }

  set specifier(specifier) {
    this.setParts({ specifier });
  }

  @computed get value() {
    return last(this.parts);
  }

  set value(value) {
    this.setParts({ value });
  }


  @action setParts(parts) {
    this._tag = filter(
      values(extend(this.asObject,
        pick(parts, 'type', 'specifier', 'value')
      )), v => !isNil(v)
    ).join(':');
  }

}
