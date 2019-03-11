import COURSE_1_DATA from '../../../api/courses/1/dashboard.json';
import COURSE_2_DATA from '../../../api/courses/2/dashboard.json';
import { keys } from 'lodash';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';
import Factory from '../../factories';

jest.useFakeTimers();

describe('Student Tasks Model', () => {
  let mockedNow;
  let course;
  let tasks;

  beforeEach(() => {
    course = Factory.course();
    Factory.studentTaskPlans({ course, count: 8 });
    tasks = course.studentTaskPlans;

    moment.tz.setDefault('America/Chicago');
    moment.locale('en');
    chronokinesis.travel(mockedNow);
    mockedNow = moment('2017-10-14T12:00:00.000Z');

    jest.mock('../../../src/flux/time', () => ({
      TimeStore: {
        getNow: jest.fn(() => mockedNow),
      },
    }));
  });

  afterEach(() => {
    tasks.clear();
    moment.tz.setDefault();
    chronokinesis.reset();
  });

  it('splits into weeks', () => {
    let week = 1;
    const start = moment('2015-11-01');
    tasks.array.forEach(t => t.due_at = moment(start).add(week += 1, 'week'));
    expect(keys(tasks.byWeek)).toEqual([
      '201546', '201547', '201548', '201549', '201550', '201551', '201552', '201553',
    ]);
  });

  it('#thisWeeksTasks', () => {
    expect(tasks.thisWeeksTasks.length).toEqual(0);
    tasks.array.forEach(t => t.due_at = tasks.startOfThisWeek);
    expect(tasks.thisWeeksTasks.length).toEqual(tasks.array.length);
  });

  it('#upcomingTasks', () => {
    const task = tasks.array[0];
    task.due_at = mockedNow.startOf('isoweek').add(1, 'week').toDate();
    expect(tasks.upcomingTasks).toContain(task);
  });

  it('#all_tasks_are_ready', () => {
    tasks.all_tasks_are_ready = true;
    tasks.onLoaded({ data: { tasks: [], all_tasks_are_ready: false } });
    expect(tasks.all_tasks_are_ready).toEqual(false);
  });

  it('polls when opened', () => {
    tasks.fetch = jest.fn(() => ( { then: (fn) => fn() } ));
    expect(tasks.refreshTimer).toBeUndefined();
    tasks.startFetching();
    expect(tasks.fetch).toHaveBeenCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(tasks.fetch).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenCalledWith(tasks.fetchTaskPeriodically, 1000 * 60 * 60 * 4);
    jest.runOnlyPendingTimers();
    expect(tasks.fetch).toHaveBeenCalledTimes(3);
    tasks.stopFetching();
    expect(clearInterval).toHaveBeenCalled();
    expect(tasks.refreshTimer).toBeNull();
  });

  it('polls quickly if tasks are not ready', () => {
    tasks.fetch = jest.fn(() => ( { then: (fn) => fn() } ));
    tasks.all_tasks_are_ready = false;
    tasks.startFetching();
    expect(setTimeout).toHaveBeenCalledWith(tasks.fetchTaskPeriodically, 60000);
  });

});
