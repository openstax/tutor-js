const {
    Factory, sequence, fake,
} = require('./helpers');
const { capitalize } = require('lodash');

Factory.define('GradingTemplate')
    .id(sequence)
    .task_plan_type(() => fake.random.arrayElement(['reading', 'homework']))
    .name(({ object }) => `Default ${capitalize(object.task_plan_type)}`)
    .completion_weight(() => fake.random.number({ min: 0, max: 1, precision: 0.01 }))
    .correctness_weight(() => fake.random.number({ min: 0, max: 1, precision: 0.01 }))
    .auto_grading_feedback_on(fake.random.boolean)
    .manual_grading_feedback_on(({ object }) =>
        object.task_plan_type == 'reading' ? 'publish' : 'grade'
    )
    .late_work_penalty_applied(({ object }) =>
        object.task_plan_type == 'reading' ? 'immediately' : 'daily'
    )
    .default_open_time('07:00')
    .default_due_time('17:00')
    .default_due_date_offset_days(1)
    .default_close_date_offset_days(1)
