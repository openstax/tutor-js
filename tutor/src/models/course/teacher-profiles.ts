import { BaseModel, field, computed, NEW_ID } from 'shared/model';
import User from '../user';

export default class CourseRole extends BaseModel {

  @field id = NEW_ID;
  @field name;

  @computed get isCurrentUser () {
      return this.id == User.profile_id;
  }

}
