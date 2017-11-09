import { React, Testing, sinon, _, ReactTestUtils } from '../helpers/component-testing';
import { Promise } from 'es6-promise';
import Student from '../../../src/models/course/student';

import UndropStudent from '../../../src/components/course-roster/undrop-student';
import { courseRosterBootstrap } from './bootstrap-data';

const displayPopover = props =>
  new Promise( function(resolve) {
    const wrapper = mount(<UndropStudent {...props} />);
    wrapper.simulate('click');
    resolve(_.last(document.querySelectorAll('.popover.undrop-student')));
  })
;

describe('Course Settings, undrop student', function() {

  let props;

  beforeEach(function() {
    props = courseRosterBootstrap();
    props.student = new Student(props.course.roster.students[0]);
    props.student.unDrop = jest.fn();
  });

  it('displays popover when clicked', function() {
    return displayPopover(props).then(dom =>
      expect(dom.querySelector('.popover-title').textContent).to.include(`Restore ${props.student.first_name}`));
  });

  it('undrops student when popover clicked', function() {
    return displayPopover(props).then(function(dom) {
      Testing.actions.click(dom.querySelector('button'));
      expect(props.student.unDrop).toHaveBeenCalled();
    });
  });

});
