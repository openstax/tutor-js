const moment = require('moment');
const {
  Factory, sequence, uuid, reference,
  fake, TITLES, APPEARANCE_CODES, PLAN_TYPES,
} = require('./helpers');

Factory.define('TeacherDashboardTaskPlan')
  .target_id(({ period }) => period ? period.id : 1 )
  .target_type('period')
  .opens_at(({ now, days_ago }) => moment(now).subtract(days_ago, 'days').format())
  .due_at(({ now, days_ago }) => moment(now).subtract(days_ago, 'days').add(3, 'days').format());


Factory.define('TeacherDashboardTask')
  .id(sequence)
  .title(fake.company.bs)
  .ecosystem_id(({ course }) => course ? course.ecosystem_id : fake.random.number({ min: 1, max: 10 }))
  .type(({ object }) => PLAN_TYPES[object.id % PLAN_TYPES.length])
  .first_published_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago - 3, 'days'))
  .is_draft(false)
  .is_preview(false)
  .is_published(true)
  .is_publishing(false)
  .is_trouble(false)
  .publish_job_url(`/api/jobs/${uuid()}`)
  .last_published_at(({ object }) => object.first_published_at)
  .publish_last_requested_at(({ object }) => object.first_published_at)
  .settings({ page_ids: ['3', '4', '7'] })
  .tasking_plans(reference('TeacherDashboardTaskPlan', {
    count({ course }) { return course ? course.periods.length : 0; },
    defaults({ course }, index) { return course ? { period: course.periods[index] } : null; },
  }));


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
  .completed_step_count(({ object }) => object.complete_exercise_count)
  .correct_exercise_count(({ object }) =>
    fake.random.number({ min: 0, max: object.complete_exercise_count })
  )
