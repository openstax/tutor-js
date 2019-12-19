import {
  BaseModel, identifiedBy, observable, computed,
} from '../../model';


export default
@identifiedBy('exercise/format')
class ExerciseFormat extends BaseModel {

  static serialize(format) {
    return format ? format.value : '';
  }

  @observable _format;

  constructor(format) {
    super();
    this._format = format;
  }

  @computed get asString() {
    return this._format;
  }

  @computed get value() {
    return this.asString;
  }

  set value(v) {
    this._format = v;
  }

}
