const moment = require('moment');
const {
  Factory, sequence, fake, APPEARANCE_CODES, PLAN_TYPES,
} = require('./helpers');


Factory.define('StudentDashboardTask')
  .id(sequence)
  .title(fake.company.bs)
  .type(({ object }) => PLAN_TYPES[object.id % PLAN_TYPES.length])
  .opens_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago, 'days'))
  .due_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago + 3, 'days'))
  .complete(() => 0 == fake.random.number(3))
  .is_deleted(false)
  .last_worked_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago, 'days').format())
  .exercise_count(() => fake.random.number({ min: 3, max: 12 }))
  .steps_count(({ object }) => object.exercise_count)
  .complete_exercise_count(({ object }) =>
    fake.random.number({ min: 0, max: object.exercise_count })
  )
  .completed_steps_count(({ object }) => object.complete_exercise_count)
  .correct_exercise_count(({ object }) =>
    fake.random.number({ min: 0, max: object.complete_exercise_count })
  )
