const {
  Factory, sequence, fake, moment, uuid, SECTION_NAMES,
} = require('./helpers');
const { range, isNil } = require('lodash');

import StudentTask from '../../src/models/student-tasks/task';

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
  .formats(({ object: { type } }) =>
    'exercise' == type ?
      [fake.random.arrayElement(['multiple-choice', 'free-response'])] : []
  )
  .uid(({ object: { id, type } }) => type == 'exercise' ? `${id}@1` : null)
  .preview(({ object: { type } }) => type == 'exercise' ?
    fake.company.bsAdjective() + ': ' + fake.random.arrayElement(SECTION_NAMES) :
    fake.random.arrayElement(SECTION_NAMES)
  )
  .external_url(({ object: { type } }) => 'external_url' == type ? fake.internet.url() : null)


Factory.define('StudentTask')
  .id(sequence)
  .students(() => [])
  .title(fake.company.catchPhraseDescriptor)
  .type(fake.random.arrayElement(Object.keys(TASK_TYPES)))
  .due_at(({ now, days_ago = 0 }) => moment(now).add(days_ago + 3, 'days'))
  .steps(({ stepCount, object: { type } }) => {
    if (type == 'event') { return []; }

    return range(0, (isNil(stepCount) ? fake.random.number({ min: 3, max: 10 }) : stepCount)).map(() => {
      return Factory.create('StudentTaskStep', {
        type: fake.random.arrayElement(TASK_TYPES[type]),
      })
    })
  })

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

Factory.define('StudentTaskExerciseStepContent')
  .id(sequence)
  .type('exercise')
  .chapter_section([1,2])
  .related_content(({ object }) => [
    { title: fake.random.arrayElement(SECTION_NAMES),
      book_location: object.chapter_section },
  ])
  .context(
    '<div data-type="note" data-has-label="true" id="fs-id2332825" class="sociological-research" a-type="term" id="import-auto-id1169033058271">geriatrics</span>, a medical specialty that focuses on the elderly. He created the word by combining were before Nascher’s ideas gained acceptance?</p> </div></div> </div>',
  )
  .content({
    tags: [
      'time:short', 'dok:2', 'blooms:2', 'type:practice',
      'requires-context:true', 'book:stax-soc', 'lo:stax-soc:13-2-2',
      'context-cnxmod:d9df5e48-4b72-482e-b616-886926188054',
      'context-cnxfeature:fs-id2332825',
    ],
    uuid: '7ddae47d-c4ec-437e-80bd-3f54d8a639a7',
    uid: '11945@4', number: 11945, version: 4,
    questions: [
      {
        id: '62902',
        is_answer_order_important: false,
        stimulus_html: '',
        stem_html: 'In the early 1900s, a New York physician named Dr. Ignatz Nascher developed a medical specialty that focused on the elderly. This field is known broadly as ___.',
        answers: [
          { id: '259301', content_html: 'geriatrics' },
          { id: '259302', content_html: 'gerontology' },
          { id: '259303', content_html: 'secondary aging' },
          { id: '259304', content_html: 'primary aging' },
        ],
        hints: [ ],
        formats: [ 'free-response', 'multiple-choice' ],
        combo_choices: [ ],
      },
    ],
  })


const TaskStepTypes = {
  reading: 'StudentTaskReadingStepContent',
  exercise: 'StudentTaskExerciseStepContent',
  interactive: 'StudentTaskInteractiveStepContent',
};

export
function studentTask(attrs = {}, modelArgs) {
  if (attrs.type && !TASK_TYPES[attrs.type]){ throw(`Unknown task type ${attrs.type}`); }

  const st = new StudentTask(this.bot.create('StudentTask', attrs), modelArgs);
  st.steps.forEach((s) => {
    s.onLoaded({ data: this.bot.create(TaskStepTypes[s.type]) });
  })
  return st;
}

export
function studentTasks({
  course = this.course(),
  count = 1,
  attributes = {},
} = {}) {
  range(count).forEach(() => {
    const task = this.studentTask(attributes);
    task.tasksMap = course.studentTasks;
    course.studentTasks.set(task.id, task)
  })
  return course.studentTasks;
}
