const { Factory, uuid, sequence } = require('./helpers');

Factory.define('User')
  .profile_id(sequence)
  .first_name(({ is_teacher }) => is_teacher ? 'Charles' : 'Atticus')
  .last_name(({ is_teacher }) => is_teacher ? 'Morris' : 'Finch')
  .name(({ object }) => `${object.first_name} ${object.last_name}`)
  .is_admin(false)
  .is_customer_service(false)
  .is_content_analyst(false)
  .is_researcher(false)
  .faculty_status(({ is_teacher }) => is_teacher ? 'confirmed_faculty' : 'student')
  .can_create_courses(({ is_teacher }) => !!is_teacher)
  .viewed_tour_stats(() => [])
  .self_reported_role(({ is_teacher }) => is_teacher ? 'faculty' : 'student')
  .account_uuid(uuid)
  .terms_signatures_needed(false)
  .school_location('domestic_school')
  .profile_url('http://localhost:2999/profile')
  .available_terms([
    { id: 1, name: 'general_terms_of_use', title: 'Do you agree?', is_signed: true },
    { id: 2, name: 'exercise_editing', title: 'Exercise editing', is_signed: false },
  ]);
