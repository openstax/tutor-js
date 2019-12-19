const moment = require('moment');
const {
  Factory, sequence, uuid, reference,
  fake, APPEARANCE_CODES, PLAN_TYPES,
} = require('./helpers');

Factory.define('TeacherTaskPlanTasking')
  .target_id(({ period }) => period ? period.id : 1 )
  .target_type('period')
  .opens_at(({ now, days_ago }) => moment(now).subtract(days_ago, 'days').format())
  .due_at(({ now, days_ago }) => moment(now).subtract(days_ago, 'days').add(3, 'days').format());


Factory.define('TeacherTaskPlan')
  .id(sequence)
  .title(fake.company.bs)
  .description(fake.commerce.productName)
  .ecosystem_id(({ course }) => course ? course.ecosystem_id : fake.random.number({ min: 1, max: 10 }))
  .type(({ object }) => PLAN_TYPES[object.id % PLAN_TYPES.length])
  .first_published_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago - 3, 'days'))
  .is_draft(false)
  .is_preview(false)
  .is_published(true)
  .is_publishing(false)
  .is_trouble(false)
  .course({})
  .publish_job_url(`/api/jobs/${uuid()}`)
  .last_published_at(({ object }) => object.first_published_at)
  .publish_last_requested_at(({ object }) => object.first_published_at)
  .settings({ page_ids: ['3', '4', '7'] })
  .tasking_plans(reference('TeacherTaskPlanTasking', {
    count({ course }) { return course ? course.periods.length : 0; },
    defaults({ course }, index) { return course ? { period: course.periods[index] } : null; },
  }));
