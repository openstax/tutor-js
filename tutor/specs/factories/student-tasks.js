const {
    Factory, sequence, fake, moment, uuid, SECTION_NAMES, PLAN_TYPES, rng,
} = require('./helpers');
const { range, isNil, cloneDeep } = require('lodash');

const TASK_TYPES={
    reading: [
        'reading',
        'exercise',
        'interactive',
    ],
    homework: [
        'exercise',
    ],
    external: [
        'external_url',
    ],
    event: [], // has no steps
};

Factory.define('StudentDashboardTask')
    .id(sequence)
    .title(fake.company.bs)
    .description(fake.company.bs)
    .type(({ object }) => PLAN_TYPES[object.id % PLAN_TYPES.length])
    .opens_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago + 3, 'days'))
    .due_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago, 'days'))
    .closes_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago - 7, 'days'))
    .last_worked_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago, 'days').format())
    .complete(() => 0 == fake.random.number(3))
    .is_deleted(false)
    .is_past_due(({ object, now }) => object.due_at <= moment(now))
    .is_extended(false)
    .task_plan_id(() => fake.random.number(100))
    .exercise_count(() => fake.random.number({ min: 3, max: 12 }))
    .steps_count(({ object }) => object.exercise_count)
    .complete_exercise_count(({ object }) =>
        fake.random.number({ min: 0, max: object.exercise_count })
    )
    .completed_steps_count(({ object }) => object.complete_exercise_count)
    .correct_exercise_count(({ object }) =>
        fake.random.number({ min: 0, max: object.complete_exercise_count })
    )
    .gradable_step_count(({ object }) =>
        fake.random.number({ min: 0, max: object.complete_exercise_count })
    )
    .ungraded_step_count(({ object }) =>
        fake.random.number({ min: 0, max: object.gradable_step_count })
    )
    .published_points(rng({ min: 0.0, max: 10.0 }))
    .is_provisional_score(true)

Factory.define('RelatedContent')
    .uuid(uuid)
    .id(sequence)
    .title(() => fake.random.arrayElement(SECTION_NAMES))
    .chapter_section(() => [
        fake.random.number({ min: 1, max: 10 }),
        fake.random.number({ min: 1, max: 10 }),
    ])

Factory.define('StudentTaskStep')
    .id(sequence)
    .type(({ parent: { type } }) => 'homework' == type ?
        'exercise' : fake.random.arrayElement(['reading', 'reading', 'reading', 'exercise'])
    )
    .is_completed(() => fake.random.arrayElement([false, false, false, true]))
    .formats(({ wrm, object: { type } }) =>
        'exercise' == type ? wrm ? ['free-response'] : ['multiple-choice', 'free-response'] : []
    )
    .uid(({ object: { id, type } }) => type == 'exercise' ? `${id}@1` : null)
    .preview(({ object: { type } }) => type == 'exercise' ?
        fake.company.bsAdjective() + ': ' + fake.random.arrayElement(SECTION_NAMES) :
        fake.random.arrayElement(SECTION_NAMES)
    )
    .external_url(({ object: { type } }) => 'external_url' == type ? fake.internet.url() : null)
    .can_be_updated(true)
    .is_feedback_available(false)
    .available_points(1)
    .published_points(({ isLateNotAccepted }) => isLateNotAccepted ? 0 : null)
    .published_points_without_lateness(({ isLateNotAccepted }) => isLateNotAccepted ? 1 : null)
    .published_late_work_point_penalty(({ isLateNotAccepted }) => isLateNotAccepted ? 1 : null)
    .exercise_id(sequence)
    .attempts_remaining(({ object: { type } }) => 'exercise' == type ? 2 : 0)
    .attempt_number(0)

Factory.define('StudentTask')
    .id(sequence)
    .title(fake.company.catchPhraseDescriptor)
    .description(fake.company.catchPhraseDescriptor)
    .type(fake.random.arrayElement(Object.keys(TASK_TYPES)))
    .opens_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago + 3, 'days'))
    .due_at_without_extension(({ now, days_ago = 0 }) => moment(now).subtract(days_ago, 'days'))
    .due_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago, 'days'))
    .closes_at_without_extension(
        ({ now, days_ago = 0 }) => moment(now).subtract(days_ago - 7, 'days')
    )
    .closes_at(({ now, days_ago = 0 }) => moment(now).subtract(days_ago - 7, 'days'))
    .auto_grading_feedback_on(fake.random.arrayElement([]))
    .manual_grading_feedback_on(fake.random.arrayElement(['grade', 'publish']))
    .completion_weight(rng({ min: 0.0, max: 1.0 }))
    .correctness_weight(({ object }) => 1.0 - object.completion_weight)
    .late_work_penalty_applied(({ isLateNotAccepted }) => isLateNotAccepted ? 'not_accepted' : fake.random.arrayElement(['daily', 'assignment', 'not_accepted']))
    .late_work_penalty_per_period(rng({ min: 0.0, max: 1.0 }))
    .published_late_work_point_penalty(0.0)
    .published_points(rng({ min: 0.0, max: 10.0 }))
    .is_provisional_score(true)
    .is_deleted(false)
    .students(() => [])
    .steps(({ stepCount, wrm, isLateNotAccepted, object: { type } }) => {
        if (type == 'event') { return []; }
        return range(0, (isNil(stepCount) ? fake.random.number({ min: 3, max: 10 }) : stepCount)).map(() => {
            return Factory.create('StudentTaskStep', {
                wrm, type: fake.random.arrayElement(TASK_TYPES[type]), isLateNotAccepted,
            })
        })
    })
    .spy({})

Factory.define('StudentTaskReadingStepContent')
    .id(sequence)
    .type('reading')
    .chapter_section([1,2])
    .related_content(({ object }) => [
        { title: fake.random.arrayElement(SECTION_NAMES),
            book_location: object.chapter_section },
    ])
    .has_learning_objectives(() => fake.random.arrayElement([ false, false, false, true ]))
    .title(fake.random.arrayElement(SECTION_NAMES))
    .html(
        '<span class="os-text">Physics: An Introduction</span> </h2> <div class="os-figure"> <figure id="import-auto-id1580373"><span data-alt="Two Canada geese flying close to each other in the sky." data-type="media" id="import-auto-id1936836"><img alt="Two Canada geese flying close to each other in the sky." data-media-type="image/wmf" id="90580" src="https://cnx.org/resources/18f7913be5bf22af357a34143dd8638511b9ba9a" width="325"></span> </figure><div class="os-caption-container"> <span class="os-title-label">Figure </span><span class="os-number">1.2</span><span class="os-divider"s as food calories, batteries, heat, light, and watch springs. Understanding this law makes it easier to learn about the various forms energy takes and how they relate to one another. Apparently unrelated topics are connected through broadly applicable physical laws, permitting an understanding beyond just the memorization of lists of facts.</p> <p id="import-auto-id2555094">The unifying aspect of physical laws and the basic simplicity'
    )

Factory.define('StudentTaskInteractiveStepContent')
    .id(sequence)
    .type('interactive')
    .chapter_section([1,2])
    .related_content(({ object }) => [
        { title: fake.random.arrayElement(SECTION_NAMES),
            book_location: object.chapter_section },
    ])
    .has_learning_objectives(() => fake.random.arrayElement([ false, false, false, true ]))
    .title(fake.random.arrayElement(SECTION_NAMES))
    .html(
        '<span class="os-text">Physics: An Introduction</span> </h2> <div class="os-figure"> <figure id="import-auto-id1580373"><span data-alt="Two Canada geese flying close to each other in the sky." data-type="media" id="import-auto-id1936836"><img alt="Two Canada geese flying close to each other in the sky." <div class="os-caption-container"> <span class="os-title-label">Figure </span><span class="os-number">1.15</span><span class="os-divider"> </span><span class="os-caption"> <a class="os-interactive-link" href="https://www.openstaxcollege.org/l/02equation_grapher"> Click here for the simulation. </a> </span> </div> </div> </div></div> </div>'
    )


const EXERCISES = range(1, 3).reduce((exercises, i) => (
    exercises.concat(require(`../../api/ecosystems/${i}/exercises.json`).items)
), []);

Factory.define('StudentTaskExerciseStepContent')
    .id(sequence)
    .type('exercise')
    .chapter_section([1,2])
    .exIndex(() => fake.random.number({ min: 0, max: EXERCISES.length - 1 }))
    .related_content(({ object }) => [
        { title: fake.random.arrayElement(SECTION_NAMES),
            book_location: object.chapter_section },
    ])
    .context(({ object: { exIndex } }) => EXERCISES[exIndex].context)
    .content(({ object: { exIndex }, wrm }) => {
        const ex = EXERCISES[exIndex];
        if (!wrm) { return ex.content }
        const wrmEx = cloneDeep(ex);
        wrmEx.content.questions.forEach(q => {
            Object.assign(q, {
                formats: ['free-response'],
                answers: [],
            });
        })
        return wrmEx.content;
    })

module.exports = { TASK_TYPES }
