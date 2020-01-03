const { Factory, uuid } = require('./helpers');

Factory.define('User')
  .name(({ is_teacher }) => is_teacher ? 'Charles Morris' : 'Atticus Finch')
  .first_name(({ is_teacher }) => is_teacher ? 'Charles' : 'Atticus')
  .last_name(({ is_teacher }) => is_teacher ? 'Morris' : 'Finch')
  .is_admin(false)
  .is_customer_service(false)
  .is_content_analyst(false)
  .is_researcher(false)
  .faculty_status(({ is_teacher }) => is_teacher ? 'confirmed_faculty' : 'student')
  .viewed_tour_stats(() => [])
  .self_reported_role(({ is_teacher }) => is_teacher ? 'faculty' : 'student')
  .account_uuid(uuid)
  .terms_signatures_needed(false)
  .profile_url('http://localhost:2999/profile');
