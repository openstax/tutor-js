import { EnzymeContext, C, TutorRouter } from '../../helpers';
import StudentPreview from '../../../src/components/student-preview';
import { bootstrapCoursesList } from '../../courses-test-data';

jest.mock('../../../src/components/youtube', () => (
  (props) => <div data-type="youtube-mock">{JSON.stringify(props)}</div>
));
jest.mock('../../../src/helpers/router');

describe('Student Preview Builder', () => {

  it('renders and matches snapshot', () => {
    bootstrapCoursesList();
    TutorRouter.currentParams.mockReturnValue({ courseId: '2' });
    TutorRouter.makePathname.mockImplementation(() => '/foo');
    expect.snapshot(<C noRef><StudentPreview /></C>).toMatchSnapshot();
  });

  it('sets back button to dashboard if theres a courseId', () => {
    TutorRouter.currentParams.mockReturnValue({ courseId: '142' });
    const preview = mount(<StudentPreview />, EnzymeContext.build());
    expect(preview.find('BackButton').props().fallbackLink).toEqual({
      to: 'dashboard',
      text: 'Back to Dashboard',
      params: { courseId: '142' },
    });
    preview.unmount();
  });

});
