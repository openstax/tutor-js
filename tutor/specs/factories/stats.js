const {
  Factory, sequence, reference, fake, moment,
} = require('./helpers');

Factory.define('Statistic')
  .notes(fake.random.number)
  .highlights(fake.random.number)
  .task_plans(fake.random.number)
  .reading_steps(fake.random.number)
  .active_courses(fake.random.number)
  .exercise_steps(fake.random.number)
  .new_highlights(fake.random.number)
  .active_students(fake.random.number)
  .new_enrollments(fake.random.number)
  .active_populated_courses(fake.random.number)

Factory.define('Stat')
  .id(sequence)
  .stats(reference('Statistic'))
  .starts_at(({ now, week_ago = 1 }) => moment(now).subtract(week_ago + 1, 'week').format())
  .ends_at(({ now, week_ago = 1 }) => moment(now).subtract(week_ago, 'week').format())
