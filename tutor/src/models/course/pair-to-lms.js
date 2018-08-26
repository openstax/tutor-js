import {
  BaseModel, identifiedBy, observable, field, belongsTo, computed, session,
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
    return this; //{ courseId: this.course.id };
  }

  onPaired({ data: { success } }) {
    this.success = success;
  }
}
