import { observable, computed } from 'mobx';
import { filter, reject } from 'lodash';
import { CourseListingActions, CourseListingStore } from '../flux/course-listing';
import Course from './course';

const coursesMap = observable.shallowMap();

function onLoaded(courseData) {
  courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd)));
}

Object.assign(coursesMap, {
  // api.coffee calls this
  bootstrap( courseData ) {
    CourseListingActions.loaded(courseData);
    onLoaded(courseData);
    CourseListingStore.on('loaded', onLoaded);
  },

  @computed get past() {
    return filter(coursesMap.values(), 'hasEnded');
  },

  @computed get currentAndFuture() {
    return reject(coursesMap.values(), 'hasEnded');
  },

});

export default coursesMap;
