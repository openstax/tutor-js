const {
    Factory,
    fake,
    uuid,
    sequence,
    reference,
} = require('./helpers');

Factory.define('ExerciseUser')
    .user_id(sequence)
    .name(fake.name.firstName);

Factory.define('ExerciseAnswer')
    .id(sequence)
    .correctness(({ siblings }) => siblings.find(a => a.correctness > 0) ? 0 : 1.0)
    .content_html(({ parent, object }) => [
        [
            'Natural philosophy and physics are essentially the same thing.',
            'Natural philosophy and physics are different.',
            'Natural philosophy included all aspects of nature excluding physics.',
            'Natural philosophy included all aspects of nature including physics.',
        ], [
            '<ol>\n  <li>matter is moving at speeds of less than roughly 1% the speed of light,</li>\n  <li>objects are large enough to be seen with the naked eye, and</li>\n  <li>there is the involvement of a weak gravitational field</li>\n</ol>\n',
            '<ol>\n  <li>matter is moving at speeds of less than roughly 1% the speed of light,</li>\n  <li>objects are too small to be seen with the naked eye, and</li>\n  <li>there is the involvement of only a weak gravitational field</li>\n</ol>\n',
            '<ol>\n  <li>matter is moving at speeds greater than roughly 1% the speed of light,</li>\n  <li>objects are large enough to be seen with the naked eye, and</li>\n  <li>there is the involvement of a strong gravitational field</li>\n</ol>\n',
            '<ol>\n  <li>matter is moving at speeds of less than roughly 1% the speed of light,</li>\n  <li>objects are large enough to be seen with the naked eye, and</li>\n  <li>there is the involvement of a strong gravitational field</li>\n</ol>\n',
        ], [
            'Physics helps in predicting how the flowing water affects Earth’s surface.',
            'Physics helps in predicting the motion of tectonic plates.',
            'Physics helps in predicting dynamics and movement of weather phenomena.',
            'Physics helps in predicting how burning fossil fuel releases pollutants.',
            'Physics is useful in weather prediction because the physical laws of motion and energy govern the movement of air masses and energy in our atmosphere, which is what generates weather.',
        ], [
            'It describes how a frame of reference is necessary to describe position or motion.',
            'It describes how people think of other people’s views from their own frame of reference.',
            'It describes how different parts of the universe are far apart and do not affect each other',
            'It describes how speed affects different observers’ measurements of time and space.',
        ], [
            'Yes, because the satellite is moving at a speed much smaller than the speed of the light and is in a strong gravitational field.',
            'Yes, because the satellite is moving at a speed much smaller than the speed of the light and it is not in a strong gravitational field.',
            'No, because the satellite is moving at a speed much smaller than the speed of the light and is in a strong gravitational field.',
            'No, because the satellite is moving at a speed much smaller than the speed of the light and is not in a strong gravitational field.',
        ],
    ][ parent.object.id % 5 ][ object.id % 4 ])
    .feedback_html(({ parent, object }) => [[
        'Biology and chemistry are also part of natural philosophy, but not part of physics.',
        'Physics is part of natural philosophy.',
        'Natural philosophy included all aspects of nature, including physics.',
        'Natural philosophy dealt with all aspects of nature by lumping physics with other fields of sciences, such as chemistry and biology. Physics mainly describes the most fundamental aspect of our universe.',
    ], [
        'Classical physics involves weak gravitational fields and objects big enough to be seen with the naked eye with their motional speed much less than the speed of light. Also, it is a subset of the Einstein’s theory of relativity where not only weak gravitational field but also strong gravity influences are studied.',
        'Objects far smaller than what is visible may require quantum mechanics.',
        'Speeds greater than roughly 1% pf the speed of light start to involve significant effects from relativity.',
        'A high gravitational field distorts space-time and leads to phenomena that classical physics fails to explain.',
    ], [
        'This is true, but its effects are not involved in day-to-day weather prediction.',
        'This is true, but it is not involved in day to day weather prediction.',
        'Physics helps in predicting dynamics and movement of weather phenomenon such as a tornado or rain.',
        'This would be chemistry rather than physics.',
    ], [
        'While that is true, it is not the content of the theory of relativity.',
        'Physics is not about people’s perceptions of other people’s opinions.',
        'This is not the main content of the theory of relativity.',
        'Einstein’s theory of relativity affects the values measured for time intervals and distances from the viewpoints of observers in relative motion to each other.',
    ], [
        'While the speed of the satellite is far less than the speed of light, if it is in a strong gravitational field it cannot be described by classical physics.',
        'Classical physics could describe the motion of a satellite because it is moving at a speed much smaller than the speed of light, because it is not in a strong gravitational field, and because it involves an object that is visible to the naked eye.',
        'Objects in a strong gravitational field cannot be described by classical physics.',
        'The speed of the satellite is far less than the speed of light so it can be described by classical physics.',
    ]][parent.object.id % 5][ object.id % 4 ]);


Factory.define('ExerciseAttachmentAsset')
    .url(({ parent: { object: { id } } }) => `/attachments/${id}.png`)
    .filename(({ parent: { object: { id } } }) => `${id}.png`)
    .small(({ parent: { object: { id } } }) => ({ url: `/attachments/small_${id}.png` }))
    .medium(({ parent: { object: { id } } }) => ({ url: `/attachments/medium_${id}.png` }))
    .large(({ parent: { object: { id } } }) => ({ url: `/attachments/large_${id}.png` }));

Factory.define('ExerciseAttachment')
    .id(sequence)
    .asset(reference('ExerciseAttachmentAsset'));

Factory.define('ExerciseQuestion')
    .id(sequence)
    .is_answer_order_important(false)
    .stimulus_html(({ object }) => [
        '',
        '',
        '',
        '<b>Meter-area reduction in copper</b> - does it affect the speed of light, etc?',
        '',
    ][object.id % 5])
    .stem_html(({ object }) => [
        'Which statement best compares and contrasts the aims and topics of natural philosophy had versus physics?',
        'What conditions imply that we can use classical physics without considering special relativity or quantum mechanics?',
        'How could physics be useful in weather prediction?',
        'In what sense does Einstein’s theory of relativity illustrate that physics describes fundamental aspects of our universe?',
        'Can classical physics be used to accurately describe a satellite moving at a speed of? Explain why or why not.',
    ][ object.id % 5 ])
    .answers(reference('ExerciseAnswer', { count: () => fake.random.number({ min: 2, max: 5 }) }))
    .hints(() => [])
    .formats(() => [
        'free-response',
        'multiple-choice',
    ])
    .combo_choices(() => [])
    .collaborator_solutions(() => [
        {
            'attachments': [],
            'solution_type': 'detailed',
            'content_html': 'four',
        },
    ])
    .community_solutions(() => []);

Factory.define('OpenEndedExerciseQuestion')
    .id(sequence)
    .is_answer_order_important(false)
    .stimulus_html(({ object }) => [][object.id % 1])
    .stem_html(({ object }) => [
        'In the context of cell biology, what do we mean by "form follows function?" What are at least two examples of this concept?',
    ][ object.id % 1 ])
    .answers(() => [])
    .hints(() => [])
    .formats(() => [
        'free-response',
    ])
    .combo_choices(() => [])
    .collaborator_solutions(() => [
        {
            'attachments': [],
            'solution_type': 'detailed',
            'content_html': 'four',
        },
    ])
    .community_solutions(() => []);

Factory.define('Exercise')
    .tags([
        'assignment-type:reading',
        'requires-context:true',
        'filter-type:test-prep',
        'blooms:3',
        'time:long',
        'dok:3',
        'lo:stax-phys:1-2-1',
        'book:stax-phys',
        'context-cnxmod:',
        'context-cnxfeature:one-1',
        'science-practice:modeling',
    ])
    .nickname(fake.internet.domainWord)
    .uuid(uuid)
    .group_uuid(uuid)
    .number(sequence)
    .version(1)
    .uid(({ object }) => `${object.number}@${object.version}`)
    .authors(reference('ExerciseUser', { count: 1 }))
    .copyright_holders(reference('ExerciseUser', { count: 1 }))
    .derived_from(() => [])
    .is_vocab(false)
    .questions(reference('ExerciseQuestion', { count: ({ multipart }) => multipart ? 3: 1 }) )
    .versions(({ object }) => [object.version])
    .attachments(reference('ExerciseAttachment', { count: 2 }));

Factory.define('OpenEndedExercise')
    .tags([
        'assignment-type:reading',
        'assignment-type:homework',
        'assignment-type:practice',
        'requires-context:true',
        'filter-type:test-prep',
        'blooms:4',
        'time:medium',
        'dok:3',
        'lo:stax-phys:1-2-1',
        'book:stax-phys',
        'context-cnxmod:',
        'context-cnxfeature:one-1',
    ])
    .nickname(fake.internet.domainWord)
    .uuid(uuid)
    .group_uuid(uuid)
    .number(sequence)
    .version(1)
    .uid(({ object }) => `${object.number}@${object.version}`)
    .authors(reference('ExerciseUser', { count: 1 }))
    .copyright_holders(reference('ExerciseUser', { count: 1 }))
    .derived_from(() => [])
    .is_vocab(false)
    .questions(reference('OpenEndedExerciseQuestion', { count: ({ multipart }) => multipart ? 3: 1 }) )
    .versions(({ object }) => [object.version]);
