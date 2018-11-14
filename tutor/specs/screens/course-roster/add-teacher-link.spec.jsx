import { ld } from '../../helpers';
import Clipboard from '../../../src/helpers/clipboard';
import { courseRosterBootstrap } from './bootstrap-data';
import AddTeacher from '../../../src/screens/course-roster/add-teacher-link';

const COURSE_ID = '1';

jest.mock('../../../src/helpers/clipboard');

const displayPopover = props =>
  new Promise( function(resolve) {
    const wrapper = mount(<AddTeacher {...props} />);
    wrapper.simulate('click');
    resolve(ld.last(document.querySelectorAll('.settings-add-instructor-modal')));
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
