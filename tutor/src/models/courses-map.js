import { ObservableMap, observable, computed } from 'mobx';
import { each, filter, reject, extend, assign } from 'lodash';
import { CourseListingActions, CourseListingStore } from '../flux/course-listing';
import Course from './course';


class CoursesMap extends ObservableMap {
  @computed get array() {
    return this.values();
  }
}

function onLoaded(courseData) {
  courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd)));
}

function mapWhere(condition) {
  const map = new CoursesMap();
  each(coursesMap.values(), c => condition(c) && map.set(c.id, c));
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
    CourseListingStore.on('loaded', onLoaded);
  }
}

const coursesMap = new AllCoursesMap();

export default coursesMap;
