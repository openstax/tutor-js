const moment = require('moment');
import JSON from '../../api/courses/22/performance.json';
const PERIOD = JSON[0];

const {
  Factory, sequence, reference, fake,
} = require('./helpers');

Factory.define('ScoresDataHeading')
  .title('Reading 1')
  .type('reading')
  .plan_id(sequence)
  .due_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago + 3, 'days'))
  .average_progress(0)
  .average_score(0)


Factory.define('ScoresStudentData')
  .id(sequence)
  .type(({ index }) => index%2 ? 'reading' : 'homework')
  .completed_accepted_late_exercise_count(0)
  .completed_accepted_late_step_count(0)
  .completed_exercise_count(0)
  .completed_on_time_exercise_count(0)
  .completed_on_time_step_count(0)
  .completed_step_count(0)
  .correct_accepted_late_exercise_count(0)
  .correct_exercise_count(0)
  .correct_on_time_exercise_count(0)
  .due_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago + 3, 'days'))
  .exercise_count(0)
  .is_included_in_averages(true)
  .is_late_work_accepted(true)
  .progress(0)
  .recovered_exercise_count(0)
  .score(0)
  .status('not_started')
  .step_count(0)


Factory.define('ScoresStudent')
  .role(sequence)
  .first_name(fake.name.firstName)
  .last_name(fake.name.lastName)
  .name(fake.name.findName)
  .student_identifier(fake.random.alphaNumeric)
  .data(reference('ScoresStudentData', { count: 4 }))
  .is_dropped(false)
  .homework_score(0.107142857142857)
  .homework_progress(0.142857142857143)
  .reading_score(0.166666666666667)
  .reading_progress(0.25)
  .course_average(0.107142857142857)

Factory.define('ScoresForPeriod')
  .period_id(({ period }) => period.id)
  .overall_course_average(({ key }) => PERIOD[key])
  .overall_homework_score(({ key }) => PERIOD[key])
  .overall_homework_progress(({ key }) => PERIOD[key])
  .overall_reading_score(({ key }) => PERIOD[key])
  .overall_reading_progress(({ key }) => PERIOD[key])
  .students(({ key }) => PERIOD[key])
  .data_headings(({ key }) => PERIOD[key])
