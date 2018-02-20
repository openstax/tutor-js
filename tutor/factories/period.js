import { Factory, sequence, uuid, reference } from './helpers';
import moment from 'moment';
import { ordinal } from '../src/helpers/number';

Factory.define('Period')
  .id(sequence)
  .name(({ parent: course }) => `${ordinal(course.periods.length + 1)}`)
  .enrollment_code(`${Math.round(Math.random() * 100000) + 10000}`)
  .enrollment_url(({ object }) => `http://localhost:3001/enroll/${object.enrollment_code}`)
  .num_enrolled_students(() => Math.round(Math.random() * 100) + 10)
  .default_open_time('00:01')
  .default_due_time('07:00')
  .is_archived(false)
  .teacher_student_role_id(sequence);
