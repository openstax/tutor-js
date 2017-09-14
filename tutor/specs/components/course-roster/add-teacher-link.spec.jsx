import { React, Testing, sinon, _, ReactTestUtils } from '../helpers/component-testing';
import { Promise } from 'es6-promise';
import Clipboard from '../../../src/helpers/clipboard';
import { courseRosterBootstrap } from './bootstrap-data';
import AddTeacher from '../../../src/components/course-roster/add-teacher-link';

const COURSE_ID = '1';

jest.mock('../../../src/helpers/clipboard');

const displayPopover = props =>
  new Promise( function(resolve, reject) {
    const wrapper = mount(<AddTeacher {...props} />);
    wrapper.simulate('click');
    resolve(_.last(document.querySelectorAll('.settings-add-instructor-modal')));
  })
;

describe('Course Settings, undrop student', function() {

  let props;

  beforeEach(function() {
    props = courseRosterBootstrap();
    Clipboard.copy.mockClear();
  });

  it('displays teacher join url when clicked', () => {
    return displayPopover(props).then(function(dom) {
      expect(dom.querySelector('input').value).toEqual(
        props.course.roster.teach_url
      );
    });
  });
});
