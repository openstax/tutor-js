import { observable, computed } from 'mobx';
import { filter, reject, extend, assign } from 'lodash';
import { CourseListingActions, CourseListingStore } from '../flux/course-listing';
import Course from './course';

const coursesMap = observable.shallowMap();

function onLoaded(courseData) {
  courseData.forEach(cd => coursesMap.set(String(cd.id), new Course(cd)));
}

extend(coursesMap, {
  bootstrap( courseData ) {
    CourseListingActions.loaded(courseData);
    onLoaded(courseData);
    CourseListingStore.on('loaded', onLoaded);
  },
});

// Object.defineProperties(coursesMap, {

//   past: {
//     get: function() { return filter(this.values(), 'hasEnded'); },
//   },

//   currentAndFuture: {
//     get: function(){ return reject(this.values(), 'hasEnded'); },
//   },

// });



export default coursesMap;
