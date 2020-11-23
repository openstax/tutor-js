import {
  BaseModel, identifiedBy, field, identifier, computed,
} from 'shared/model';
import User from '../user';
  
export default
  @identifiedBy('course/teacherProfiles')
class CourseRole extends BaseModel {
  
  @identifier id;
  @field name;
  
  @computed get isCurrentUser () {
    return this.id == User.profile_id;
  }

  }
