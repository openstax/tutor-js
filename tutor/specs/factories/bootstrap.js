const { Factory, reference } = require('./helpers');
require('./course.js')
require('./user.js')
require('./offering.js')

Factory.define('BootstrapData')
    .user(reference('User', { profile_id: 1, defaults: ({ is_teacher }) => ({ is_teacher }) }))
    .courses(reference('Course', { count: ({ num_courses = 3 }) => num_courses }))
    .offerings(({ is_teacher }) => (is_teacher ?
        ['biology', 'physics', 'sociology', 'apush'].map((type) => Factory.create('Offering', { type })) :
        []
    ))
