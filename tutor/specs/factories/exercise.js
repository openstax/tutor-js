import { random, first } from 'lodash';
const {
  Factory, sequence, uuid, reference,
} = require('./helpers');

Factory.define('TutorExercise')
  .id(sequence)
  .content(reference('Exercise'))
  .has_interactive(() => random(0,3) == 1)
  .has_video(() => random(0,1) == 1)
  .is_excluded(false)
  .page_uuid(uuid)
  .pool_types(() => [
    random(0,1) == 1 ? 'homework_core' : 'reading_dynamic',
  ])
  .tags(({ object }) =>
    object.content.tags.map(t => ({ id: t, type: first(t.split(':')), is_visible: true })),
  )
  .url(({ object }) =>
    `https://exercises.openstax.org/exercises/${object.content.uid}`
  )
  .question_stats(() => []);
