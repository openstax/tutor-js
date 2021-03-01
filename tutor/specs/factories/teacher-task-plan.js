const moment = require('moment');
const {
    Factory, sequence, uuid, reference,
    fake, PLAN_TYPES,
} = require('./helpers');
const { times } = require('lodash');

const WRM_ID = 3;
const TITLES = times(50, () => fake.company.bs());

Factory.define('TeacherTaskPlanTasking')
    .target_id(({ period }) => period ? period.id : 1 )
    .target_type('period')
    .opens_at(({ now, days_ago }) => moment(now).subtract(days_ago, 'days').toISOString())
    .due_at(({ now, days_ago }) => moment(now).subtract(days_ago, 'days').add(3, 'days').toISOString())
    .closes_at(({ now, days_ago }) => moment(now).subtract(days_ago, 'days').add(5, 'days').toISOString());


Factory.define('TeacherTaskPlan')
    .id(sequence)
    .title(({ object: { id } }) => id == WRM_ID ? 'WRM' : TITLES[id] || fake.company.bs)
    .description(fake.commerce.productName)
    .ecosystem_id(({ course }) => course ? course.ecosystem_id : fake.random.number({ min: 1, max: 10 }))
    .type(({ object }) => object.id == WRM_ID ? 'homework' : PLAN_TYPES[object.id % PLAN_TYPES.length])
    .first_published_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago - 3, 'days').toISOString())
    .is_draft(false)
    .is_preview(false)
    .is_published(true)
    .is_publishing(false)
    .is_trouble(false)
    .course({})
    .ungraded_step_count(({ object: { id } }) => id == WRM_ID ? fake.random.number({ min: 0, max: 100 }) : 0)
    .publish_job_url(`/api/jobs/${uuid()}`)
    .last_published_at(({ object }) => object.first_published_at)
    .publish_last_requested_at(({ object }) => object.first_published_at)
    .settings(({ type, exercises }) => {
        const s = { page_ids: ['3', '4', '7'] };
        if (type == 'homework') {
            s.exercises = (exercises || times(4).map(() => Factory.create('TutorExercise'))).map(ex => ({
                id: ex.id,
                points: Array(ex.content.questions.length).fill(1.0),
            }))
        }
    })
    .tasking_plans(reference('TeacherTaskPlanTasking', {
        count({ course }) { return course ? course.periods.length : 0; },
        defaults({ course, days_ago }, index) {
            return {
                ...(course ? { period: course.periods[index] } : {}),
                days_ago,
            };
        },
    }));
