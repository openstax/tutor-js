import { ObservableMap, computed } from 'mobx';
import { CourseListingActions, CourseListingStore } from '../flux/course-listing';
import Course from './course';
import { once } from 'lodash';

class CoursesMap extends ObservableMap {
  @computed get array() {
    return this.values();
  }

}

function onLoaded(courseData) {
  courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd)));
}

const listenForLoad = once(() => {
  CourseListingStore.on('loaded', onLoaded);
});

function mapWhere(condition) {
  const map = new CoursesMap();
  coursesMap.forEach(c => {
    if(condition(c)) { map.set(c.id, c); }
  });
  return map;
}

class AllCoursesMap extends CoursesMap {

  @computed get active() {
    return mapWhere(c => c.is_active);
  }

  @computed get completed() {
    return mapWhere(c => c.hasEnded);
  }

  @computed get future() {
    return mapWhere(c => !c.hasStarted);
  }

  @computed get currentAndFuture() {
    return mapWhere(c => !c.hasEnded);
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
