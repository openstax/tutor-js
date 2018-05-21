import {
  BaseModel, identifiedBy, observable, computed, action,
} from '../../model';
import { isObject, first, last, filter, extend, values, pick, isNil } from 'lodash';

const TYPES = {
  IMPORTANT: ['lo', 'aplo', 'blooms', 'dok', 'length', 'time'],
};

@identifiedBy('exercise/tag')
export default class ExerciseTag extends BaseModel {

  @observable _tag;

  constructor(tag) {
    super();
    if (isObject(tag)) {
      this.setParts(tag);
    } else {
      this._tag = tag;
    }
  }

  static serialize(t) {
    return t.asString;
  }

  @computed get isImportant() {
    return TYPES.IMPORTANT.includes(this.type);
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

  @computed get isLO() {
    return Boolean(this.type === 'lo' || this.type === 'aplo');
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
