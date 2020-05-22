import { observable, computed } from 'mobx';
import Courses from '../../models/courses-map';

export default class StudentGradeBookUX {

  @observable isReady = false;

  constructor(props) {
    this.initialize(props);
    this.props = props;
  }

  async initialize({
    courseId,
    course = Courses.get(courseId),
  }) {
    this.course = course;
    await this.course.scores.fetch();

    this.isReady = true;
  }

  @computed get role() {
    return this.course.currentRole;
  }

  @computed get scores() {
    return this.course.scores.periods.get(this.role.period_id);
  }

  @computed get headings() {
    return this.scores.data_headings;
  }

  @computed get student() {
    return this.scores.students.find(s => s.role == this.role.id);
  }
}
