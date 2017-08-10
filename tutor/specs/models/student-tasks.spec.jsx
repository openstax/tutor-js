import StudentTasks from '../../src/models/student-tasks';
import COURSE_1_DATA from '../../api/courses/1/dashboard.json';
import COURSE_2_DATA from '../../api/courses/2/dashboard.json';
import { keys, times } from 'lodash';
import chronokinesis from 'chronokinesis';

jest.useFakeTimers();

describe('Student Tasks Model', () => {

  beforeEach(() => {
    chronokinesis.travel(new Date('2015-10-14T12:00:00.000Z'));
    StudentTasks.forCourseId(1).onLoaded({ data: COURSE_1_DATA });
    StudentTasks.forCourseId(2).onLoaded({ data: COURSE_2_DATA });
  });

  afterEach(() => {
    StudentTasks.clear();
    chronokinesis.reset();
  });

  it('splits into weeks', () => {
    expect(keys(StudentTasks.forCourseId(1).byWeek)).toEqual([
      '201515', '201516', '201517', '201519', '201521', '201618',
    ]);
    expect(keys(StudentTasks.forCourseId(2).byWeek)).toEqual([
      '201515', '201516', '201517', '201519', '201521',
    ]);
  });

  it('polls for updates', () => {
    const tasks = StudentTasks.forCourseId(1);
    tasks.fetch = jest.fn(() => Promise.resolve({}));
    tasks.pollForUpdates({ expectedCount: 42 });
    expect(tasks.fetch).toHaveBeenCalled();
    expect(tasks._updatesPoller).not.toBeNull();
    jest.runAllTimers();
    expect(tasks.fetch).toHaveBeenCalledTimes(2);
    times(41, (i) => tasks.set(i, {}));
    jest.runAllTimers();
    expect(tasks.fetch).toHaveBeenCalledTimes(3);
    tasks.set(42, {});
    expect(tasks.array).toHaveLength(42);
    jest.runAllTimers();
    expect(tasks.fetch).toHaveBeenCalledTimes(3);
    expect(tasks._updatesPoller).toBeNull();
  });

});
