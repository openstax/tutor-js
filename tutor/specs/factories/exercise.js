const { first } = require('lodash');
const {
  Factory, sequence, uuid, reference, fake,
} = require('./helpers');
require('../../../shared/specs/factories/exercise')

Factory.define('TutorExercise')
  .id(sequence)
  .content(reference('Exercise'))
  .has_interactive(() => fake.random.arrayElement([true, false, false, false]))
  .has_video(() => fake.random.arrayElement([true, false, false]))
  .is_excluded(false)
  .page_uuid(uuid)
  .pool_types(() => [
    fake.random.arrayElement(['homework_core', 'reading_dynamic' ]),
  ])
  .tags(({ object }) =>
    object.content.tags.map(t => ({ id: t, type: first(t.split(':')), is_visible: true })),
  )
  .url(({ object }) =>
    `https://exercises.openstax.org/exercises/${object.content.uid}`
  )
  .question_stats(() => []);

Factory.define('OpenEndedTutorExercise')
  .id(sequence)
  .content(reference('OpenEndedExercise'))
  .has_interactive(() => fake.random.arrayElement([true, false, false, false]))
  .has_video(() => fake.random.arrayElement([true, false, false]))
  .is_excluded(false)
  .page_uuid(uuid)
  .pool_types(() => [
    fake.random.arrayElement(['homework_core', 'reading_dynamic' ]),
  ])
  .tags(({ object }) =>
    object.content.tags.map(t => ({ id: t, type: first(t.split(':')), is_visible: true })),
  )
  .url(({ object }) =>
    `https://exercises.openstax.org/exercises/${object.content.uid}`
  )
  .question_stats(() => []);
