import { Actions, ld } from '../../helpers';
import Student from '../../../src/models/course/student';
jest.mock(
  'popper.js',
  () =>
    class Popper {
      static placements = [
        'auto',
        'auto-end',
        'auto-start',
        'bottom',
        'bottom-end',
        'bottom-start',
        'left',
        'left-end',
        'left-start',
        'right',
        'right-end',
        'right-start',
        'top',
        'top-end',
        'top-start'
      ];

      constructor() {
        return {
          destroy: () => {},
          scheduleUpdate: () => {}
        };
      }
    }
);

import UndropStudent from '../../../src/screens/course-roster/undrop-student';
import { courseRosterBootstrap } from './bootstrap-data';

describe('Course Settings, undrop student', function() {

  let props;

  beforeEach(function() {
    props = courseRosterBootstrap();
    props.student = new Student(props.course.roster.students[0]);
    props.student.unDrop = jest.fn();
  });

  it('displays popover when clicked', () => {
    const wrapper = mount(<UndropStudent {...props} />);
    wrapper.simulate('click');
    expect(
      wrapper.find('.popover-header').text()
    ).toContain(`Restore ${props.student.first_name}`);
  });

  it('undrops student when popover clicked', function() {
    const wrapper = mount(<UndropStudent {...props} />);
    wrapper.simulate('click');
    expect(
      wrapper.find('.popover-header').text()
    ).toContain(`Restore ${props.student.first_name}`);
    wrapper.find('button.undrop-student').simulate('click');
    expect(props.student.unDrop).toHaveBeenCalled()
  });

});
