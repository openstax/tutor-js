import Map from 'shared/model/map';
import moment from 'moment-timezone';
import { readonly } from 'core-decorators';
import { computed, action, observable } from 'mobx';
import { filter, groupBy, sortBy, pickBy } from 'lodash';
import { TimeStore } from '../flux/time';
import Task from './student/task';
import ResearchSurveys from './research-surveys';

const MAX_POLLING_ATTEMPTS = 10;
const POLL_SECONDS = 30;
const ISOWEEK_FORMAT = 'GGGGWW';
const FETCH_INITIAL_TASKS_INTERVAL = 1000 * 60; // every minute;
const REFRESH_TASKS_INTERVAL = 1000 * 60 * 60 * 4; // every 4 hours

export class CourseStudentTasks extends Map {
  @readonly static Model = Task;

  @observable researchSurveys;
  @observable expecting_assignments_count = 0;
  @observable all_tasks_are_ready = false;
  @observable refreshTimer;

  constructor(course) {
    super();
    this.course = course;
  }

  @computed get byWeek() {
    const weeks = groupBy(this.array, event => moment(event.due_at).startOf('week').format(ISOWEEK_FORMAT));
    const sorted = {};
    for (let weekId in weeks) {
      const events = weeks[weekId];
      sorted[weekId] = sortBy(events, 'due_at');
    }
    return sorted;
  }

  @computed get pastEventsByWeek() {
    const thisWeek = moment(TimeStore.getNow()).startOf('week').format(ISOWEEK_FORMAT);
    return pickBy(this.byWeek, (events, week) => week < thisWeek);
  }

  weeklyEventsForDay(day) {
    return this.byWeek[moment(day).startOf('week').format(ISOWEEK_FORMAT)] || [];
  }

  // Returns events who's due date has not passed
  upcomingEvents(now = TimeStore.getNow()) {
    return sortBy(filter(this.array, event => event.due_at > now), 'due_at');
  }

  // note: the response also contains limited course and role information but they're currently unused
  onLoaded({ data: { tasks, research_surveys, all_tasks_are_ready } }) {
    this.researchSurveys = research_surveys ? new ResearchSurveys(research_surveys) : null;
    this.mergeModelData(tasks);
    this.all_tasks_are_ready = all_tasks_are_ready;
  }

  @computed get isPendingTaskLoading() {
    return Boolean(
      (false === this.all_tasks_are_ready) &&
        this.course.primaryRole.joinedAgo('minutes') < 30
    );
  }

  @action.bound fetchTaskPeriodically() {
    return this.fetch().then(() => {
      const interval = this.isPendingTaskLoading ?
        FETCH_INITIAL_TASKS_INTERVAL : REFRESH_TASKS_INTERVAL;
      this.refreshTimer = setTimeout(this.fetchTaskPeriodically, interval);
    });
  }

  @action startFetching() {
    return this.refreshTimer ? Promise.resolve() : this.fetchTaskPeriodically();
  }

  @action stopFetching() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

}

class StudentTasks extends Map {

  forCourse(course) {
    let tasks = this.get(course.id);
    if (!tasks) {
      tasks = new CourseStudentTasks(course);
      this.set(course.id, tasks);
    }
    return tasks;
  }

}

const studentTasks = new StudentTasks;
export default studentTasks;
