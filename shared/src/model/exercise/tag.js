import {
  BaseModel, identifiedBy, observable, computed, action,
} from '../../model';
import { isObject, first, last, filter, extend, values, pick, isNil } from 'lodash';

const TYPES = {
  IMPORTANT: ['lo', 'aplo', 'blooms', 'dok', 'length', 'time'],
};

const TITLES = {
  'hts:1': 'HTS-1 Developments and Processes',
  'hts:2': 'HTS-2 Sourcing and Situation',
  'hts:3': 'HTS-3 Source Claims and Evidence',
  'hts:4': 'HTS-4 Contextualization',
  'hts:5': 'HTS-5 Making Connections',
  'hts:6': 'HTS-6 Argumentation',
  'rp:1':  'RP-1 Comparison',
  'rp:2':  'RP-2 Causation',
  'rp:3':  'RP-3 Continuity and Change',
};

export default
@identifiedBy('exercise/tag')
class ExerciseTag extends BaseModel {

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

  @computed get validity() {
    // if it's an "important" tag it must have a value
    if (!this.isImportant || this.value) {
      return { valid: true };
    }
    return { valid: false, part: `${this.type} must have value` };
  }

  @computed get name() {
    return this.asString;
  }

  @computed get title() {
    return TITLES[this.asString] || this.asString;
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
