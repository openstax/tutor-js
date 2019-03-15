import { Factory } from '../../helpers';
import Student from '../../../src/models/scores/student';

describe('scores student model', () => {
  let student;

  beforeEach(() => {
    student = new Student(Factory.bot.create('ScoresStudentData'));
    student.period = {};
    student.period.course = Factory.course();
  });

  it('adjusts scores', () => {
    student.data.push({
      is_included_in_averages: true,
      type: 'homework',
      score: 0.4,
      step_count: 10,
      completed_accepted_late_step_count: 0,
      completed_on_time_step_count: 8,
    });

    student.adjustScores({ type: 'homework' });
    expect(student.homework_progress.toString()).toEqual('0.8');
    expect(student.isValid('homework')).toBe(true);

    expect(student.isValid('reading')).toBe(false);
    expect(student.course_average).toBeUndefined();

    student.data.push({
      is_included_in_averages: true,
      type: 'reading',
      score: 0.4,
      step_count: 10,
      completed_accepted_late_step_count: 0,
      completed_on_time_step_count: 8,
    });

    student.adjustScores({ type: 'reading' });
    expect(student.isValid('reading')).toBe(true);
    expect(student.course_average.toString()).toEqual('0.48');
  });
});
