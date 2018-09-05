import StudentTasks from '../../src/models/student-tasks';
import COURSE_1_DATA from '../../api/courses/1/dashboard.json';
import COURSE_2_DATA from '../../api/courses/2/dashboard.json';
import { keys, times } from 'lodash';
import chronokinesis from 'chronokinesis';
import moment from 'moment-timezone';

jest.useFakeTimers();

describe('Student Tasks Model', () => {
  let mockedNow;

  beforeEach(() => {
    mockedNow = moment('2017-10-14T12:00:00.000Z');
    moment.tz.setDefault('America/Chicago');
    chronokinesis.travel(mockedNow);
    jest.mock('../../src/flux/time', () => ({
      TimeStore: {
        getNow: jest.fn(() => mockedNow),
      },
    }));

    StudentTasks.forCourseId(1).onLoaded({ data: COURSE_1_DATA });
    StudentTasks.forCourseId(2).onLoaded({ data: COURSE_2_DATA });
  });

  afterEach(() => {
    StudentTasks.clear();
    moment.tz.setDefault();
    chronokinesis.reset();
  });

  it('splits into weeks', () => {
    expect(keys(StudentTasks.forCourseId(1).byWeek)).toEqual([
      '201515', '201516', '201517', '201519', '201521', '201616',
    ]);
    expect(keys(StudentTasks.forCourseId(2).byWeek)).toEqual([
      '201515', '201516', '201517', '201519', '201521',
    ]);
    const task = StudentTasks.forCourseId(1).array[0];
    task.due_at = new Date('2014-12-30');
    expect(keys(StudentTasks.forCourseId(1).byWeek)).toEqual([
      '201501', '201515', '201516', '201517', '201519', '201521', '201616',
    ]);

  });

  it('#upcomingEvents', () => {
    const tasks = StudentTasks.forCourseId(1);
    const task = tasks.array[0];
    task.due_at = mockedNow.add(1, 'week').toDate();
    expect(tasks.upcomingEvents()).toEqual([task]);
  });

  it('#all_tasks_are_ready', () => {
    const tasks = StudentTasks.forCourseId(1);
    expect(tasks.all_tasks_are_ready).toEqual(true);
    tasks.onLoaded({ data: { tasks: [], all_tasks_are_ready: false } });
    expect(tasks.all_tasks_are_ready).toEqual(false);
  });
});
