const {
    Factory, fake, sequence,
} = require('./helpers');
const { capitalize, get, flatMap, isNil } = require('lodash');
require('../../specs/factories/task-plan-stats');

Factory.define('TaskPlanPeriodStudent')
    .role_id(sequence)
    .task_id(sequence)
    .first_name(fake.name.firstName)
    .last_name(fake.name.lastName)
    .student_identifier(() => fake.random.alphaNumeric(fake.random.number({ min: 5, max: 12 })))
    .is_dropped(() => fake.random.arrayElement([false,false,false,false,false,false,false,false,false,false,false,false,true]))
    .available_points(({ parent: { object } }) => object.question_headings.length)
    .total_points(({ parent: { object } }) => object.question_headings.length)
    .total_fraction(1)
    .late_work_point_penalty(0)
    .questions(({ object: { role_id }, parent: { exercises, grades } }) => flatMap(exercises, (exercise) => (
        exercise.content.questions.map((question) => {
            const is_completed = fake.random.arrayElement([true, true, true, true, true, false])
            const is_correct = fake.random.arrayElement([true, true, true, true, true, false])
            const selected_answer = is_correct ? question.answers.find(a => a.correctness > 0) : fake.random.arrayElement(question.answers)
            const points = selected_answer && selected_answer.correctness > 0 ? 1.0 : 0
            const taskStepId = `${role_id}:${question.id}` // we don't really have steps with the mock data
            const grade = (grades ? grades[taskStepId] : null) || {  }
            return {
                task_step_id: taskStepId,
                question_id: question.id,
                exercise_id: exercise.id,
                grader_comments: grade.grader_comments,
                grader_points: grade.grader_points,
                needs_grading: isNil(grade.grader_points),
                is_completed,
                points,
                selected_answer_id: selected_answer && selected_answer.id,
                free_response: is_completed ? fake.lorem.sentence() : null,
            };
        })
    )))


Factory.define('TaskPlanPeriodScore')
    .period_id(({ period }) => period.id)
    .name(({ period }) => period.name)
    .late_work_fraction_penalty(0)
    .available_points(({ exercises }) => ({
        total_points: exercises.length,
        total_fraction: 1,
    }))
    .average_score(({ exercises }) => ({
        total_points: exercises.length,
        total_fraction: 1,
    }))
    .num_questions_dropped(0)
    .points_dropped(0)
    .question_headings(({ exercises }) => {
        return flatMap(exercises, (exercise, i) => (
            exercise.content.questions.map((question) => ({
                title: `Q${i+1}`,
                exercise_id: exercise.id,
                question_id: question.id,
                points: 1.0,
                points_without_dropping: 1.0,
                is_completed: true,
                type: question.answers.length == 0 ? 'WRQ' : 'MCQ',
            }))
        ))
    })
    .students(Factory.reference('TaskPlanPeriodStudent', {
        count: () => fake.random.number({ min: 3, max: 10 }),

    }))


Factory.define('TaskPlanScores')
    .id(({ task_plan }) => get(task_plan, 'id', fake.random.number()))
    .type(({ task_plan }) => get(task_plan, 'type', fake.random.arrayElement(['homework', 'reading'])))
    .title(({ object }) => `${capitalize(object.type)} ${object.id}`)
    .dropped_questions([])
    .grading_template(({ object }) => Factory.create('GradingTemplate', { task_plan_type: object.type }))
    .tasking_plans(({ task_plan, course, exercises }) => {
        const { periods } = (course || task_plan.course || Factory.create('Course'))
        return periods.map(period =>
            Factory.create('TaskPlanPeriodScore', { period, task_plan, exercises }));
    })
