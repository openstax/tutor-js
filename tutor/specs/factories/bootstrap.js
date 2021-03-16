const { Factory, reference } = require('./helpers');
require('./course.js')
require('./user.js')
require('./offering.js')

Factory.define('BootstrapData')
    .accounts_api_url('http://localhost:8111/api')
    .tutor_api_url('http://localhost:8111/api')
    .user(reference('User', { profile_id: 1, defaults: ({ is_teacher }) => ({ is_teacher }) }))
    .courses(reference('Course', {
        defaults: ({ is_teacher }) => ({ is_teacher }) ,
        count: ({ num_courses = 3 }) => num_courses,
    }))
    .offerings(({ is_teacher }) => (is_teacher ?
        ['biology', 'physics', 'sociology', 'apush'].map((type) => Factory.create('Offering', { type })) :
        []
    ))
