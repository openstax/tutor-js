import { find, pick, last } from 'lodash';
import { computed, action, runInAction } from 'mobx';
import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
} from 'shared/model';

export default
@identifiedBy('course/period')
class CoursePeriod extends BaseModel {
  @identifier id;

  @field name;
  @field default_due_time;
  @field default_open_time;
  @field enrollment_code;
  @field enrollment_url;
  @field is_archived;
  @field teacher_student_role_id;

  @field num_enrolled_students = 0;

  @belongsTo({ model: 'course' }) course;

  @computed get scores() {
    return this.course.scores.periods.get(this.id);
  }

  @computed get hasEnrollments() {
    return this.num_enrolled_students > 0;
  }

  @computed get isActive() {
    return !this.is_archived;
  }

  @computed get enrollment_url_with_details() {
    const details = `${this.course.name}-${this.course.termFull}`.replace(/ /g, '-');
    return `${this.enrollment_url}/${details}`;
  }

  isNameValid( name ) {
    return Boolean(
      this.name == name || !find(this.course.periods, { name })
    );
  }

  // called from API
  save() {
    return { courseId: this.course.id, data: pick(this, 'name') };
  }
  create() {
    return { courseId: this.course.id, data: pick(this, 'name') };
  }
  archive() { }
  unarchive() {
    return { id: this.id, data: { is_archived: false } };
  }
  @action afterCreate({ data }) {
    this.update(data);
    this.course.periods.push(this);
  }

  @action async getTeacherStudentRole() {
    let role = this.course.roles.find((r) => (
      r.isTeacherStudent && r.period_id == this.id
    ));
    if (!role) {
      const { data } = await this.createTeacherStudent();
      role = this.course.roles.find(r => r.id == data.id );
    }
    runInAction(() => {
      role.joined_at = new Date(); // adjust the date so it always appears new
      let student = find(this.course.students, { id: -1 });
      if (!student) {
        this.course.students.push({ id: -1 });
        student = last(this.course.students);
      }
      student.update({
        id: -1,
        role_id: role.id,
        student_identifier: '',
        first_name: 'Review',
        is_comped: true,
        last_name: 'Student',
        name: 'Teacher Review Student',
        period_id: this.id,
        prompt_student_to_pay: false,
      });
    });
    return role;
  }

  createTeacherStudent() {
    return { courseId: this.course.id, id: this.id };
  }

  @action onCreateTeacherStudent({ data }) {
    this.course.roles.push(data);
  }
}
