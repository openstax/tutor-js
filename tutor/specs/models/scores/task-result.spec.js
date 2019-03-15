import { filter } from 'lodash';
import Factory from '../../factories';

describe('scores store task results', () => {
  let scores;
  let course;

  beforeEach(() => {
    course = Factory.course({ num_periods: 1 });
    Factory.scores({ course });
    scores = course.scores;

    course.update({
      homework_score_weight: 0.50,
      homework_progress_weight: 0.10,
      reading_score_weight: 0.20,
      reading_progress_weight: 0.20,
    });
  });

  describe('dropped students', () => {
    it('does not include them', () => {
      const task = scores.getTask('2882');
      expect(task.student.isActive).toBe(false);
      expect(
        task.reportHeading.averageForType('score').toFixed(2),
      ).toEqual('0.11');
      task.score = 1.0;
      expect(
        task.reportHeading.averageForType('score').toFixed(2),
      ).toEqual('0.11');
    });
  });


  describe('with n/a values', () => {
    let task;
    let tests;
    let period;

    beforeEach(() => {
      period = scores.periods.values()[0];
      filter(period.data_headings, { type: 'reading' }).forEach(reading =>
        period.data_headings.remove(reading),
      );
      period.overall_course_average = undefined;
      period.overall_reading_score = undefined;
      period.overall_reading_progress = undefined;

      period.students.forEach((s) => {
        filter(s.data, { type: 'reading' }).forEach(reading =>
          s.data.remove(reading),
        );
      });
      task = scores.getTask(1882); // a homework
      tests = [
        {
          object: task, property: 'completed_accepted_late_exercise_count',
          from: 0, to: 7,
        }, {
          object: task, property: 'student.homework_progress',
          precision: 5, from: 0.142857, to: 0.25,
        }, {
          object: task, property: 'student.homework_score',
          precision: 5, from: 0.107142, to: 0.142857,
        }, {
          object: task, property: 'student.course_average',
          precision: 5, from: 0.067857142, to: 0.0964285,
        }, {
          object: task, property: 'period.overall_homework_progress',
          precision: 5, from: 0.0714285714285714, to: 0.125,
        }, {
          object: task, property: 'period.overall_homework_score',
          precision: 5, from: 0.0535714, to: 0.07142857142,
        }, {
          object: task, property: 'reportHeading.average_score',
          precision: 5, from: 0.107142857, to: 0.142857142,
        }, {
          object: task, property: 'reportHeading.average_progress',
          precision: 5, from: 0.142857142, to: 0.25,
        },
      ];
    });

    it ('has no readings', () => {
      expect(scores.getTask(1883)).toBeNull();
    });

    it('matches expected values', () => {
      expect(
        () => task.onLateWorkAccepted()
      ).toHaveChanged(tests);
      // it shouldn't update reading or course avg
      expect(period.overall_course_average).toBeUndefined();
      expect(period.overall_reading_score).toBeUndefined();
      expect(period.overall_reading_progress).toBeUndefined();
    });

    it('onLateWorkRejected matches expected values', () => {
      task.onLateWorkAccepted();
      tests.forEach((t) => {
        const { from, to } = t;
        t.from = to;
        t.to = from;
      });
      expect(
        () => task.onLateWorkRejected()
      ).toHaveChanged(tests);
    });
  });

  describe('homework', () => {
    let task;
    let tests;

    beforeEach(() => {
      task = scores.getTask(1882); // a homework
      tests = [
        {
          object: task, property: 'completed_accepted_late_exercise_count',
          from: 0, to: 7,
        }, {
          object: task, property: 'student.homework_progress',
          precision: 5, from: 0.142857, to: 0.25,
        }, {
          object: task, property: 'student.homework_score',
          precision: 5, from: 0.107142, to: 0.142857,
        }, {
          object: task, property: 'student.course_average',
          precision: 5, from: 0.067857142, to: 0.0964285,
        }, {
          object: task, property: 'period.overall_homework_progress',
          precision: 5, from: 0.0714285714285714, to: 0.125,
        }, {
          object: task, property: 'period.overall_homework_score',
          precision: 5, from: 0.0535714, to: 0.07142857142,
        }, {
          object: task, property: 'period.overall_course_average',
          precision: 5, from: 0.033928571, to: 0.04821428571,
        }, {
          object: task, property: 'reportHeading.average_score',
          precision: 5, from: 0.10714285714, to: 0.1428571428,
        }, {
          object: task, property: 'reportHeading.average_progress',
          precision: 5, from: 0.142857142, to: 0.25,
        },
      ];
    });

    it('matches expected values', () => {
      expect(
        () => task.onLateWorkAccepted()
      ).toHaveChanged(tests);
    });

    it('onLateWorkRejected matches expected values', () => {
      task.onLateWorkAccepted();
      tests.forEach((t) => {
        const { from, to } = t;
        t.from = to;
        t.to = from;
      });
      expect(
        () => task.onLateWorkRejected()
      ).toHaveChanged(tests);
    });
  });

  describe('reading', () => {
    let task;
    let tests;

    beforeEach(() => {
      task = scores.getTask(1883); // a reading

      tests = [
        {
          object: task, property: 'correct_accepted_late_exercise_count',
          from: 0, to: 1,
        }, {
          object: task, property: 'student.reading_progress',
          precision: 5, from: 0.0, to: 0.3846153,
        }, {
          object: task, property: 'student.reading_score',
          precision: 5, from: 0, to: 0.071428571,
        }, {
          object: task, property: 'student.course_average',
          precision: 5, from: 0.067857142, to: 0.1590659,
        }, {
          object: task, property: 'period.overall_reading_progress',
          precision: 5, from: 0.0, to: 0.192307692,
        }, {
          object: task, property: 'period.overall_reading_score',
          precision: 5, from: 0.0, to: 0.035714285,
        }, {
          object: task, property: 'period.overall_course_average',
          precision: 5, from: 0.033928, to: 0.07953296,
        }, {
          object: task, property: 'reportHeading.average_score',
          precision: 5, from: 0.0, to: 0.07142857,
        }, {
          object: task, property: 'reportHeading.average_progress',
          precision: 5, from: 0.0, to: 0.384615384,
        },
      ];

    });

    it('matches expected values', () => {
      expect(
        () => task.onLateWorkAccepted()
      ).toHaveChanged(tests);
    });

    it('onLateWorkRejected matches expected values', () => {
      task.onLateWorkAccepted();
      tests.forEach((t) => {
        const { from, to } = t;
        t.from = to;
        t.to = from;
      });
      expect(
        () => task.onLateWorkRejected()
      ).toHaveChanged(tests);
    });

  });

});
