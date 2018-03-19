import {
  BaseModel, identifiedBy, identifier, field, hasMany, observable, computed,
} from '../../model';


@identifiedBy('exercise/format')
export default class ExerciseFormat extends BaseModel {

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
