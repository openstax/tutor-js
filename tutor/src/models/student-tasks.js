import Map from './map';
import moment from 'moment';
import { computed } from 'mobx';
import { filter, groupBy, sortBy, pickBy } from 'lodash';
import { TimeStore } from '../flux/time';
import Task from './student/task';

export class CourseStudentTasks extends Map {

  constructor(courseId) {
    super();
    this.courseId = courseId;
  }

  @computed get byWeek() {
    const weeks = groupBy(this.array, event => moment(event.due_at).startOf('isoweek').format('YYYYww'));
    const sorted = {};
    for (let weekId in weeks) {
      const events = weeks[weekId];
      sorted[weekId] = sortBy(events, 'due_at');
    }
    return sorted;
  }

  @computed get pastEventsByWeek() {
    const thisWeek = moment(TimeStore.getNow()).startOf('isoweek').format('YYYYww');
    return pickBy(this.byWeek, (events, week) => week < thisWeek);
  }

  weeklyEventsForDay(day) {
    return this.byWeek[moment(day).startOf('isoweek').format('YYYYww')] || [];
  }

  // Returns events who's due date has not passed
  upcomingEvents(now) {
    if (now == null) { now = TimeStore.getNow(); }
    return sortBy(filter(this.array, 'isUpcoming'), 'due_at');
  }

  // note: the response also contains limited course and role information but they're currently unused
  onLoaded({ data: { tasks } }) {
    tasks.forEach(task => this.set(task.id, new Task(task)));
  }
}

class StudentTasks extends Map {

  forCourseId(courseId) {
    let courseMap = this.get(courseId);
    if (!courseMap) {
      courseMap = new CourseStudentTasks(courseId);
      this.set(courseId, courseMap);
    }
    return courseMap;
  }

}

const studentTasks = new StudentTasks;
export default studentTasks;
