const {
  Factory, sequence, uuid, reference,
  TITLES, APPEARANCE_CODES,
} = require('./helpers');
const moment = require('moment');
const { ordinal } = require('../../src/helpers/number');


Factory.define('Period')
  .id(sequence)
  .name(({ parent }) => {
    const length = parent.periods ? parent.periods.length : 0;
    return `${ordinal(length + 1)}`;
  })
  .enrollment_code(`${Math.round(Math.random() * 100000) + 10000}`)
  .enrollment_url(({ object }) => `http://localhost:3001/enroll/${object.enrollment_code}`)
  .num_enrolled_students(() => Math.round(Math.random() * 100) + 10)
  .default_open_time('00:01')
  .default_due_time('07:00')
  .is_archived(false)
  .teacher_student_role_id(sequence);

Factory.define('Role')
  .id(sequence)
  .type('student')
  .joined_at(({ parent }) => moment(parent.starts_at).add(1, 'week').toISOString());

Factory.define('Course')
  .id(sequence)
  .uuid(uuid)
  .name(({ type = 'physics' }) => TITLES[type])
  .term('spring')
  .year(2017)
  .starts_at(({ now, months_ago = 0 }) => moment(now).add(months_ago - 1, 'months').toISOString())
  .ends_at(({ now, months_ago = 0 }) => moment(now).add(months_ago + 1, 'months').toISOString())
  .is_active(({ now, object }) => !moment(now).isAfter(object.ends_at))
  .time_zone('Central Time (US & Canada)')
  .default_open_time('00:32')
  .default_due_time('07:00')
  .cloned_from_id(null)
  .salesforce_book_name(({ object }) => object.name)
  .appearance_code(({ type = 'physics' }) => APPEARANCE_CODES[type])
  .ecosystem_id(1)
  .ecosystem_book_uuid(uuid)
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
  .num_sections(3)
  .periods(reference('Period', { count: ({ num_periods = 3 }) => num_periods }))
  .students([])
  .roles(({ object, is_teacher }) => [
    Factory.create('Role', {
      parent: object, type: is_teacher ? 'teacher' : 'student'
    })
  ]);
