const {
    Factory, sequence, reference, fake, TITLES,
} = require('./helpers');
const { capitalize, cloneDeep } = require('lodash');
require('../../specs/factories/task-plan-stats');

Factory.define('TaskPlanExerciseAnswer')
    .students(() => [ { id: 1, name: fake.name.findName() } ])
    .free_response(() => fake.lorem.sentences())
    .answer_id(sequence)

Factory.define('TaskPlanExerciseStat')
    .question_id(({ question }) => question.id)
    .answered_count(({ period }) => period.total_count)
    .answers(({ question }) => question.answers.map(answer => Factory.create('TaskPlanExerciseAnswer', { answer })))


Factory.define('TaskPlanStatPage')
    .id(sequence)
    .title(({ parent }) => TITLES[parent.type || 'physics'])
    .student_count(() => fake.random.number({ min: 10, max: 40 }))
    .correct_count(({ parent }) => fake.random.number({ min: 1, max: parent.total_count }))
    .incorrect_count(({ object }) => object.student_count - object.correct_count)
    .chapter_section(({ index }) => [ 1, index + 1 ])
    .exercises(({ parent }) =>
        (parent.exercises || []).map( exercise => Factory.create('TutorExercise', {
            ...cloneDeep(exercise),
            question_stats: exercise.content.questions.map(question => Factory.create('TaskPlanExerciseStat', {
                question,
                period: parent.period,
            })),
        }))
    )
    .is_trouble(() => fake.random.number(4) === 0);

Factory.define('TaskPlanPeriodStat')
    .period_id(({ period }) => period.id)
    .name(({ period }) => period.name)
    .mean_grade_percent(() => fake.random.number({ min: 30, max: 100 }))
    .total_count(({ exercises }) => exercises ? exercises.length : 2)
    .complete_count(({ object }) => fake.random.number({ min: 0, max: object.total_count }))
    .partially_complete_count(({ object }) => object.total_count - object.comlete_count)
    .current_pages(reference('TaskPlanStatPage', { count: 3 }));


Factory.define('TaskPlanStats')
    .id(sequence)
    .type('homework')
    .title(({ object }) => `${capitalize(object.type)} Chapter ${object.id}`)
    .stats(({ course, exercises, task_plan = Factory.create('TeacherTaskPlan', { type: 'homework', course, exercises }) }) => {
        const { periods } = (course || task_plan.course || Factory.create('Course'))
        return periods.map(period =>
            Factory.create('TaskPlanPeriodStat', { period, task_plan, exercises }));
    });
