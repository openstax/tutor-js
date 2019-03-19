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

  it('adjusts even if one is undefined', () => {
    student.data.push({
      is_included_in_averages: true,
      type: 'homework',
      score: 0.4,
      step_count: 10,
      completed_accepted_late_step_count: 0,
      completed_on_time_step_count: 8,
    });

    student.period.course.reading_progress_weight = 0.5;
    student.reading_progress = 0.1;
    student.period.course.reading_score_weight = 0;
    student.reading_score = undefined;
    expect(student.isValid('reading')).toBe(true);

    student.period.course.homework_progress_weight = 0.5;
    student.homework_progress = 0.8;
    student.period.course.homework_score_weight = 0;
    student.homework_score = undefined;
    expect(student.isValid('homework')).toBe(true);

    student.adjustScores({ type: 'homework' });
    // the real test is if the adjustScores threw an exception due to the undefines
    expect(student.course_average.toString()).toEqual('0.45');
  });
});
