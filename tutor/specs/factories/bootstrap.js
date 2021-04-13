const { Factory, reference } = require('./helpers');
require('./course')
require('./user')
require('./offering')

Factory.define('BootstrapData')
    .accounts_api_url('http://localhost:8111/api')
    .tutor_api_url('http://localhost:8111/api')
    .feature_flags({})
    .user(reference('User', { profile_id: 1, defaults: ({ is_teacher }) => ({ is_teacher }) }))
    .offerings(() =>
        ['biology', 'physics', 'sociology', 'apush'].map((type) => Factory.create('Offering', { type }))
    )
    .courses(reference('Course', {
        defaults: ({ is_teacher, object }) => ({ is_teacher, offerings: object.offerings }) ,
        count: ({ num_courses = 3 }) => num_courses,
    }))
