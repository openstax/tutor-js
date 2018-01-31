import { bootstrapCoursesList } from '../../../courses-test-data';
import DATA from '../../../../api/courses/2/performance.json';

const COURSE_ID = 2;

describe('scores store task results', () => {
  let scores;
  let course;
  let period;

  beforeEach(() => {
    course = bootstrapCoursesList().get(COURSE_ID);
    course.update({
      reading_progress_weight: 0.25,
      homework_score_weight: 0.25,
      homework_progress_weight: 0.25,
      reading_score_weight: 0.25,
    });
    scores = course.scores;
    scores.onFetchComplete({ data: DATA });
    period = course.scores.periods.get('1');
  });

  describe('homework', () => {
    let task;
    let tests;

    beforeEach(() => {
      task = scores.getTask(313); // a homework
      tests = [
        {
          value: () => task.correct_accepted_late_exercise_count,
          from: 0, to: 1,
        }, {
          value: () => task.completed_accepted_late_exercise_count,
          from: 0, to: 2,
        }, {
          value: () => task.score,
          from: 0.25, to: 0.5,  // 1/4 correct on time, 1/4 correct but late
        }, {
          value: () => task.student.homework_progress,
          precision: 5, from: 0.125, to: 0.375 // 1/8 -> 3/8
        }, {
          value: () => task.student.homework_score,
          precision: 5, from: 0.375, to: 0.5  // 3/8 correct -> 4/8
        }, {
          value: () => task.student.reading_progress,
          precision: 5, from: 0.169491, to: 0.169491 // no change
        }, {
          value: () => task.student.reading_score,
          precision: 5, from: 0.0, to: 0.0 // no change
        }, {
          value: () => task.reportHeading.average_score,
          precision: 5, from: 0.375, to: 0.5 // 3/8 -> 4/8
        }, {
          value: () => task.reportHeading.average_progress,
          precision: 5, from: 0.375, to: 0.625  // 3/8 -> 5/8
        }, {
          value: () => period.overall_homework_progress,
          precision: 5, from: 0.4375, to: 0.46875, // 7/16 -> 9/16 * 0.25
        }, {
          value: () => period.overall_homework_score,
          precision: 5, from: 0.022556, to: 0.03818, // 3/16 -> 4/16 * 0.25
        }
      ];

    })

    it('matches expected values', () => {
      expect(
        () => task.onLateWorkAccepted()
      ).toHaveChanged(tests)
    })

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
      task = scores.getTask(257); // a reading
      tests = [
        {
          value: () => task.completed_accepted_late_step_count,
          from: 0, to: 5,
        }, {
          value: () => task.completed_accepted_late_exercise_count,
          from: 0, to: 0,
        }, {
          value: () => task.correct_accepted_late_exercise_count,
          from: 0, to: 4
        }, {
          value: () => task.score,
          from: 0.0, to: 0.36, // 0/11 -> 4/11
        }, {
          value: () => task.student.homework_progress,
          precision: 5, from: 0.125, to: 0.125, //  no change
        }, {
          value: () => task.student.homework_score,
          precision: 5, from: 0.375, to: 0.375 //  no change
        }, {
          value: () => task.student.reading_progress,
          precision: 5, from: 0.169491, to: 0.254237,  // 10/59 -> 15/59
        }, {
          value: () => task.student.reading_score,
          precision: 5, from: 0.0, to: 0.067796,  // 0/59 -> 4/59
        }, {
          value: () => period.overall_reading_progress,
          precision: 5, from: 0.094017, to: 0.104700,  // 11/117 -> 14/117 * 0.25
        }, {
          value: () => period.overall_reading_score,
          precision: 5, from: 0.042735, to: 0.05128 // 5/117 -> 8/117 * 0.25
        }
      ];
    });

    it('matches expected values', () => {
      expect(
        () => task.onLateWorkAccepted()
      ).toHaveChanged(tests)
    })

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

  })

})
