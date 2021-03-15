const {
    Factory, sequence, uuid, reference,
    fake, TITLES, APPEARANCE_CODES,
} = require('./helpers');
const moment = require('moment');
const { ordinal } = require('../../src/helpers/number');
const { BOOK_UID_XREF } = require('../../../shared/src/helpers/book-uuid-xrefs');

Factory.define('Period')
    .id(sequence)
    .name(({ index }) => {
        return `${ordinal(index + 1)}`;
    })
    .enrollment_code(`${fake.random.number({ min: 10000, max: 99999 })}`)
    .enrollment_url(({ object }) => `http://localhost:3001/enroll/${object.enrollment_code}`)
    .num_enrolled_students(() => fake.random.number({ min: 5, max: 80 }))
    .default_open_time('00:01')
    .default_due_time('07:00')
    .is_archived(false)
    .teacher_student_role_id(sequence);

Factory.define('Role')
    .type('student')
    .id(({ object }) => object.type == 'teacher' ? 7 : fake.random.number({ min: 10, max: 100 }))
    .joined_at(({ parent }) => moment(parent.starts_at).add(1, 'week').toISOString());


Factory.define('Student')
    .id(sequence)
    .is_active(true)
    .is_comped(false)
    .is_paid(false)
    .first_name(fake.name.firstName)
    .last_name(fake.name.lastName)
    .payment_due_at(({ now, days_ago = 0 }) => moment(now).add(days_ago + 3, 'days'))
    .prompt_student_to_pay(false)
    .role_id(sequence)
    .student_identifier(fake.random.alphaNumeric)

Factory.define('Course')
    .id(sequence)
    .uuid(uuid)
    .name(({ type = 'physics' }) => TITLES[type])
    .code('OX-1')
    .term('spring')
    .year(2017)
    .starts_at(({ now, months_ago = 0 }) => moment(now).add(months_ago - 3, 'months').toISOString())
    .ends_at(({ now, months_ago = 0 }) => moment(now).add(months_ago + 1, 'months').toISOString())
    .is_active(({ now, object }) => !moment(now).isAfter(object.ends_at))
    .timezone('US/Central')
    .default_open_time('00:32')
    .default_due_time('07:00')
    .cloned_from_id(null)
    .salesforce_book_name(({ object }) => object.name)
    .appearance_code(({ type = 'physics' }) => APPEARANCE_CODES[type])
    .ecosystem_id(({ object }) => object.id)
    .ecosystem_book_uuid(() => fake.random.arrayElement(Object.keys(BOOK_UID_XREF)))
    .offering_id(1)
    .book_pdf_url('https://archive.cnx.org/exports/185cbf87-c72e-48f5-b51e-f14f21b5eabd.pdf')
    .webview_url('https://qa.cnx.org/contents/185cbf87-c72e-48f5-b51e-f14f21b5eabd')
    .is_preview(false)
    .is_concept_coach(false)
    .is_college(true)
    .is_access_switchable(true)
    .does_cost(false)
    .is_lms_enabling_allowed(false)
    .homework_score_weight(0.4)
    .homework_progress_weight(0.1)
    .reading_score_weight(0.2)
    .reading_progress_weight(0.2)
    .homework_weight(0.5)
    .reading_weight(0.5)
    .num_sections(3)
    .periods(reference('Period', { count: ({ num_periods = 3 }) => num_periods }))
    .roles(({ object, is_teacher }) => [
        Factory.create('Role', {
            parent: object, type: is_teacher ? 'teacher' : 'student',
        }),
    ])
    .students(({ object, is_teacher }) => [
        Factory.create('Student', {
            parent: object,
            role_id: is_teacher ? 1 : object.roles[0].id,
        }),
    ])
    .teacher_profiles([
        { id: 1, name: 'Review Teacher 1' },
        { id: 2, name: 'Review Teacher 2' },
    ])
