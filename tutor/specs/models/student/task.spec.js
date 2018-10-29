import Task from '../../../src/models/student/task';
import moment from 'moment';
import COURSE_1ldDATA from '../../../api/courses/1/dashboard.json';

const TASK = COURSE_1_DATA.tasks[0];
jest.mock('../../../src/flux/time', () => ({
  TimeStore: {
    getNow: jest.fn(() => new Date()),
  },
}));

describe('Student Task Model', () => {

  let task;

  beforeEach(() => {
    task = new Task();
  });

  it('#canWork', () => {
    task.opens_at = moment().add(1, 'day');
    expect(task.canWork).toBe(false);
    task.opens_at = moment().subtract(1, 'day');
    expect(task.canWork).toBe(true);
    task.is_deleted = true;
    expect(task.canWork).toBe(true);
    task.complete_exercise_count = 0;
    expect(task.canWork).toBe(false);
  });

});
