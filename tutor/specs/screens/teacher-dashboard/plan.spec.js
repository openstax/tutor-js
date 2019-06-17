import Header from '../../../src/screens/teacher-dashboard/header';
import Factory from '../../factories';
import moment from 'moment';

describe('CourseCalendar Header', function() {
  let course;
  let props = {};

  beforeEach(() => {
    course = Factory.course();
    props = {
