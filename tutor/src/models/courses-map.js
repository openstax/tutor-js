import Map from './map';
import { computed, action } from 'mobx';
import Course from './course';
import { isEmpty, sortBy } from 'lodash';

class CoursesMap extends Map {

  // override array in Map to return a sorted list
  @computed get array() {
    return sortBy(this.values(), 'sortKey');
  }

  @computed get active() {
    return this.where(c => c.is_active);
  }

  @computed get costing() {
    return this.where(c => c.does_cost);
  }

  @computed get student() {
    return this.where(c => c.isStudent);
  }

  @computed get teaching() {
    return this.where(c => c.isTeacher);
  }

  @computed get completed() {
    return this.where(c => c.hasEnded);
  }

  @computed get future() {
    return this.where(c => !c.hasStarted);
  }

  @computed get currentAndFuture() {
    return this.where(c => !c.hasEnded);
  }

  @computed get tutor() {
    return this.where(c => !c.is_concept_coach);
  }

  @computed get conceptCoach() {
    return this.where(c => c.is_concept_coach);
  }

  @computed get nonPreview() {
    return this.where(c => !c.is_preview);
  }

  @computed get previouslyCreated() {
    return this.where(c => !c.just_created);
  }

  @computed get preview() {
    return this.where(c => c.is_preview);
  }

  @computed get isViewed() {
    return this.where(c => c.dashboardViewCount > 0);
  }

  @action addNew(courseData) {
    const course = new Course(courseData, this);
    course.just_created = true;
    this.set(course.id, course);
    return course;
  }

  isNameValid(name) {
    return Boolean(!isEmpty(name) && !find(this.array, { name }));
  }

  bootstrap( courseData, options = {} ) {
    if (options.clear) { this.clear(); }
    courseData.forEach(cd => this.set(String(cd.id), new Course(cd, this)));
    return this;
  }

  // called by API
  fetch() { }

  @action onLoaded({ data }) {
    data.forEach((cd) => {
      const course = this.get(cd.id);
      course ? course.update(cd) : this.set(cd.id, new Course(cd, this));
    });
  }

}

const coursesMap = new CoursesMap();

export default coursesMap;
