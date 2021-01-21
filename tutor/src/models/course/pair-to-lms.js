import {
  BaseModel, identifiedBy, observable,
} from 'shared/model';

@identifiedBy('course/create')
export default class CoursePair extends BaseModel {

  @observable course;
  @observable success;


  constructor(course) {
    super();
    this.course = course;
  }

  save() {
    return this;
  }

  onPaired({ data: { success } }) {
    this.success = success;
  }
}
