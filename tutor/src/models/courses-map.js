import Map from './map';
import { computed, action } from 'mobx';
import { CourseListingActions, CourseListingStore } from '../flux/course-listing';
import { CourseStore } from '../flux/course';
import Course from './course';
import { once, isEmpty } from 'lodash';

function onCourseSave(courseData) {
  coursesMap.get(courseData.id).update(courseData);
}

function onLoaded(courseData) {
  courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd)));
}

const listenForLoad = once(() => {
  CourseListingStore.on('loaded', onLoaded);
  CourseStore.on('saved', onCourseSave);
});

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
    CourseListingActions.loaded([courseData]);
    return course;
  }

  isNameValid(name) {
    return Boolean(!isEmpty(name) && !find(this.array, { name }));
  }

  bootstrap( courseData, options = {} ) {
    CourseListingActions.loaded(courseData);
    if (options.clear) { this.clear(); }
    onLoaded(courseData);
    setTimeout(listenForLoad, 10); // wait for the initial onload to fire
    return coursesMap;
  }

}

const coursesMap = new CoursesMap();

export default coursesMap;
