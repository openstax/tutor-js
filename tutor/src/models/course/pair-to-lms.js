import {
  BaseModel, identifiedBy, observable,
} from 'shared/model';

export default
@identifiedBy('course/create')
class CoursePair extends BaseModel {

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
