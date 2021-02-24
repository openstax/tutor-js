import Clipboard from '../../../src/helpers/clipboard';
import { courseRosterBootstrap } from './bootstrap-data';
import AddTeacher from '../../../src/screens/course-roster/add-teacher-link';

const COURSE_ID = '1';

jest.mock('../../../src/helpers/clipboard');

const displayPopover = props =>
    new Promise( function(resolve) {
        const wrapper = mount(<AddTeacher {...props} />);
        wrapper.find('Button').simulate('click');
        return resolve(wrapper.find('Modal').first());
    })
;

describe('Course Settings, undrop student', function() {

    let props;

    beforeEach(function() {
        props = courseRosterBootstrap();
        Clipboard.copy.mockClear();
    });

    it('displays teacher join url when clicked', () => {
        return displayPopover(props).then((modal) => {
            expect(modal.find('input').props().value).toEqual(
                props.course.roster.teach_url
            );
        });
    });
});
