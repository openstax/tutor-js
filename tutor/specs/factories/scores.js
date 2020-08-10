const {
  Factory, sequence, reference, fake, rng,
} = require('./helpers');
const { capitalize } = require('lodash');
const moment = require('moment');
const JSON = require('../../api/courses/22/performance.json');
const PERIOD = JSON[0];

Factory.define('ScoresDataHeading')
  .type(() => fake.random.arrayElement(['reading', 'homework']))
  .title(({ index, object: { type } }) => `${capitalize(type)} ${index+1}`)
  .plan_id(sequence)
  .due_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago + 3, 'days'))
  .average_progress(rng({ min: 0, max: 1 }))
  .average_score(rng({ min: 0, max: 1 }))
  .available_points(rng({ min: 1, max: 50 }))

Factory.define('ScoresStudentData')
  .id(sequence)
  .type(({ index, data_headings }) => data_headings.length <= 0 ? null : data_headings[index].type )
  .status(() => fake.random.arrayElement(['not_started', 'in_progress', 'completed']))
  .step_count(rng({ min: 3, max: 20 }))
  .completed_step_count(({ object: { step_count } }) => fake.random.number({ min: 0, max: step_count }))
  .exercise_count(({ object: { step_count } }) => fake.random.number({ min: 0, max: step_count }))
  .completed_exercise_count(({ object: { exercise_count } }) => fake.random.number({ min: 0, max: exercise_count }))
  .correct_exercise_count(({ object: { completed_exercise_count } }) => fake.random.number({ min: 0, max: completed_exercise_count }))
  .due_at(({ index, data_headings }) => data_headings.length <= 0 ? null : data_headings[index].due_at )
  .score(() => fake.random.number({ min: 0, max: 1 }))
  .progress(() => fake.random.number({ min: 0, max: 1 }))
  .available_points(({ index, data_headings }) => data_headings.length <= 0 ? null : data_headings[index].available_points )
  .points(({ object: { status, available_points } }) => status == 'not_started' ? 0 : fake.random.number({ min: 0, max: available_points }))

Factory.define('ScoresStudent')
  .first_name(fake.name.firstName)
  .last_name(fake.name.lastName)
  .name(({ object: { first_name, last_name } }) => `${first_name} ${last_name}`)
  .role(sequence)
  .student_identifier(() => fake.random.alphaNumeric(10))
  .homework_score(() => fake.random.number({ min: 0, max: 1 }))
  .homework_progress(() => fake.random.number({ min: 0, max: 1 }))
  .reading_score(() => fake.random.number({ min: 0, max: 1 }))
  .reading_progress(() => fake.random.number({ min: 0, max: 1 }))
  .total_fraction(() => fake.random.number({ min: 0, max: 1 }))
  .is_dropped(false)
  .data(reference('ScoresStudentData', {
    defaults({ parent: { object: { data_headings } } }) {
      return { data_headings }
    },
    count({ parent: { object: { data_headings } } }) {
      return data_headings.length;
    },
  }))

Factory.define('ScoresForPeriod')
  .period_id(({ period }) => period.id)
  .overall_course_average(({ key }) => PERIOD[key])
  .overall_homework_score(({ key }) => PERIOD[key])
  .overall_homework_progress(({ key }) => PERIOD[key])
  .overall_reading_score(({ key }) => PERIOD[key])
  .overall_reading_progress(({ key }) => PERIOD[key])
  .data_headings(reference('ScoresDataHeading', { count: rng({ min: 5, max: 20 }) }))
  .students(reference('ScoresStudent', { count: rng({ min: 5, max: 40 }) }))

Factory.define('NoAssignmentsScoresForPeriod')
  .period_id(({ period }) => period.id)
  .data_headings([])
  .students(reference('ScoresStudent', { count: rng({ min: 5, max: 40 }) }))
