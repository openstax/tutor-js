const {
  Factory, sequence, reference, fake, TITLES,
} = require('./helpers');
const { times, capitalize } = require('lodash');

Factory.define('TaskPlanExerciseAnswer')
  .student_names(() => [ fake.name.findName() ])
  .free_response(() => fake.lorem.sentences())
  .answer_id(sequence)

Factory.define('TaskPlanExerciseStat')
  .question_id(sequence)
  .answered_count(({ period }) => period.total_count)
  .answers(reference('TaskPlanStatPage', { count: 10 }));


Factory.define('TaskPlanStatPage')
  .id(sequence)
  .title(({ parent }) => TITLES[parent.type || 'physics'])
  .student_count(() => fake.random.number({ min: 10, max: 40 }))
  .correct_count(({ parent }) => fake.random.number({ min: 1, max: parent.total_count }))
  .incorrect_count(({ object }) => object.student_count - object.correct_count)
  .chapter_section(({ index }) => [ 1, index + 1 ])
  .exercises(({ parent }) =>
    times(parent.object.total_count, () =>
      Factory.create('TutorExercise', {
        question_stats: [
          Factory.create('TaskPlanExerciseStat', {
            period: parent,
          }),
        ],
      })
    )
  )
  .is_trouble(() => fake.random.number(4) === 0);


Factory.define('TaskPlanPeriodStat')
  .period_id(({ period }) => period.id)
  .name(({ period }) => period.name)
  .mean_grade_percent(() => fake.random.number({ min: 30, max: 100 }))
  .total_count(() => fake.random.number({ min: 3, max: 20 }))
  .complete_count(({ object }) => fake.random.number({ min: 0, max: object.total_count }))
  .partially_complete_count(({ object }) => object.total_count - object.comlete_count)
  .current_pages(reference('TaskPlanStatPage', { count: 10 }));


Factory.define('TaskPlanStat')
  .id(sequence)
  .type('homework')
  .title(({ object }) => `${capitalize(object.type)} Chapter ${object.id}`)
  .stats(({ course }) => {
    const { periods } = (course || Factory.create('Course'))
    return periods.map(period =>
      Factory.create('TaskPlanPeriodStat', { period }));
  });
