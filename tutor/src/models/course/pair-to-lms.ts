import { BaseModel, observable } from 'shared/model';

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
