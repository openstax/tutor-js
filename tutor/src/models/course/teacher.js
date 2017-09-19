import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
} from '../base';

@identifiedBy('course/teacher')
export default class CourseTeacher extends BaseModel {

  @identifier id;

  @field first_name;
  @field last_name;
  @field role_id;

  @belongsTo({ model: 'course/roster' }) roster;

  drop() {
    return { id: this.id };
  }

  onDropped() {
    this.roster.teachers.remove(this);
  }
}
