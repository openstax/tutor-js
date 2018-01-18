import Map from './map';
import moment from 'moment-timezone';
import { readonly } from 'core-decorators';
import { computed, action, observable } from 'mobx';
import { filter, groupBy, sortBy, pickBy } from 'lodash';
import { TimeStore } from '../flux/time';
import Task from './student/task';
import ResearchSurveys from './research-surveys';

const MAX_POLLING_ATTEMPTS = 10;
const POLL_SECONDS = 30;

export class CourseStudentTasks extends Map {
  @readonly static Model = Task;

  @observable _updatesPoller;
  @observable researchSurveys;

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
  upcomingEvents(now = TimeStore.getNow()) {
    return sortBy(filter(this.array, event => event.due_at > now), 'due_at');
  }

  @computed get isFetchingInitialUpdates() {
    return Boolean(this.array.length == 0 && this._updatesPoller);
  }

  // note: the response also contains limited course and role information but they're currently unused
  onLoaded({ data: { tasks, research_surveys } }) {
    this.researchSurveys = research_surveys ? new ResearchSurveys(research_surveys) : null;
    this.mergeModelData(tasks);
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
