const moment = require('moment');
const {
  Factory, sequence, uuid, reference,
  fake, TITLES, APPEARANCE_CODES, PLAN_TYPES,
} = require('./helpers');

// Factory.define('TeacherDashboardTaskPlan')
//   .tasking_plans(({ now, days_ago, course }) => course.periods.map(p => ({
//     target_id: p.id,
//     target_type: "period",
//     opens_at: moment(now).subtract(days_ago, 'days')
//   })))

Factory.define('TeacherDashboardTask')
  .id(sequence)
  .title(fake.company.bs)
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
  .settings({ page_ids: ["3", "4", "7"] });



Factory.define('StudentDashboardTask')
  .id(sequence)
  .title(fake.company.bs)
  .type(({ object }) => PLAN_TYPES[object.id % PLAN_TYPES.length])
  .opens_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago, 'days'))
  .due_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago + 3, 'days'))
  .complete(() => 0 == fake.random.number(3))
  .is_deleted(false)
  .exercise_count(() => fake.random.number({ min: 3, max: 12 }))
  .complete_exercise_count(({ object }) =>
    fake.random.number({ min: 0, max: object.exercise_count })
  );
