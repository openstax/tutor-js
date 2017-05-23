import Map from './map';
import { computed, action } from 'mobx';
import { CourseListingActions, CourseListingStore } from '../flux/course-listing';
import Course from './course';
import { once } from 'lodash';

class CoursesMap extends Map {


}

function onLoaded(courseData) {
  courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd)));
}

const listenForLoad = once(() => {
  CourseListingStore.on('loaded', onLoaded);
});

class AllCoursesMap extends CoursesMap {

  @computed get active() {
    return this.where(c => c.is_active);
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

  @computed get nonPreview() {
    return this.where(c => !c.is_preview);
  }

  @action addNew(courseData) {
    const course = new Course(courseData);
    this.set(course.id, course);
    CourseListingActions.loaded([courseData]);
    return course;
  }

  bootstrap( courseData, options = {} ) {
    CourseListingActions.loaded(courseData);
    if (options.clear) { this.clear(); }
    onLoaded(courseData);
    listenForLoad();
    return coursesMap;
  }

}

const coursesMap = new AllCoursesMap();

export default coursesMap;
