import Map from './map';
import { computed, action } from 'mobx';
import Course from './course';
import { once, isEmpty } from 'lodash';
//
// function onCourseSave(courseData) {
//   coursesMap.get(courseData.id).update(courseData);
// }
//
// function onLoaded(courseData) {
//   courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd, this)));
// }
//
class CoursesMap extends Map {

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

  @action addNew(courseData) {
    const course = new Course(courseData);
    this.set(course.id, course);
    return course;
  }

  isNameValid(name) {
    return Boolean(!isEmpty(name) && !find(this.array, { name }));
  }

  bootstrap( courseData, options = {} ) {
    if (options.clear) { this.clear(); }
    courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd, this)));
    //onLoaded(courseData);
    //    setTimeout(listenForLoad, 10); // wait for the initial onload to fire
    return coursesMap;
  }

  // called by API
  fetch() { }

}

const coursesMap = new CoursesMap();

export default coursesMap;
