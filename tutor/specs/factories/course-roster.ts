const {
    Factory, sequence, reference, fake,
} = require('./helpers');
const moment = require('moment');

Factory.define('CourseRosterStudent')
    .id(sequence)
    .role_id(sequence)
    .is_active(true)
    .is_comped(false)
    .is_paid(false)
    .name(fake.name.findName)
    .first_name(fake.name.firstName)
    .last_name(fake.name.lastName)
    .payment_due_at(({ now, days_ago = 0 }) => moment(now).add(days_ago + 3, 'days'))
    .period_id(({ parent }) => parent.course.periods[0].id)
    .prompt_student_to_pay(false)
    .student_identifier(fake.random.alphaNumeric)

Factory.define('CourseRosterTeacher')
    .id(sequence)
    .role_id(({ course, index }) => index == 0 ? course.roles[0].id : fake.random.number({ min: 10, max: 100 }))
    .first_name(fake.name.firstName)
    .last_name(fake.name.lastName)
    .is_active(true)

Factory.define('CourseRoster')
    .teach_url('http://localhost:3001/teach/6d79445c999bbca09a6e33d62e540022/DO_NOT_GIVE_TO_STUDENTS')
    .students(
        reference('CourseRosterStudent', {
            count: ({ numStudents }) => (numStudents == null) ? 10 : numStudents,
        })
    )
    .teachers(
        reference('CourseRosterTeacher', { count: 2, defaults: ({ course }) => ({ course }) })
    )
