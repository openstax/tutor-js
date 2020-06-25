import { TimeMock, Factory } from '../../../helpers';
import COURSE_1_DATA from '../../../../api/courses/1/dashboard.json';
import moment from 'moment';

describe('Student Dashboard Task Model', () => {

  let task;
  const now = TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    task = Factory.studentDashboardTask();
  });

  it('#isViewable', () => {
    task.opens_at = moment(now).add(1, 'day');
    expect(task.isViewable).toBe(false);
    task.opens_at = moment(now).subtract(1, 'day');
    expect(task.isViewable).toBe(true);
    task.is_deleted = true;
    task.complete_exercise_count = 0;
    expect(task.isViewable).toBe(false);
    task.complete_exercise_count = 1;
    expect(task.isViewable).toBe(true);
  });

  it('hw#humanProgress', () => {
    task.complete = false;
    task.completed_steps_count = 0;
    task.correct_exercise_count = 0;
    task.type = 'homework';
    expect(task.humanProgress).toEqual('Not started');
    task.completed_steps_count = 1;
    task.complete_exercise_count = 1;

    task.exercise_count = 3;
    task.steps_count = 8;
    expect(task.humanProgress).toEqual('1/8 completed');
    task.due_at = moment(now).subtract(1, 'day');
    task.complete = true;
    expect(task.humanProgress).toEqual('Complete');
  });

  it('reading#humanProgress', () => {
    task.complete = false;
    task.completed_steps_count = 0;
    task.type = 'reading';
    expect(task.humanProgress).toEqual('Not started');
    task.completed_steps_count = 1;
    expect(task.humanProgress).toEqual('In progress');
    task.complete = true;
    expect(task.humanProgress).toEqual('Complete');
  });

  it('external#humanProgress', () => {
    task.complete = false;
    task.type = 'external';
    expect(task.humanProgress).toEqual('Not started');
    task.complete = true;
    expect(task.humanProgress).toEqual('Clicked');
  });

});
