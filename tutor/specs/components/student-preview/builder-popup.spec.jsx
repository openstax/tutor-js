import FakeWindow from 'shared/specs/helpers/fake-window';
import BuilderPopup from '../../../src/components/student-preview/builder-popup';
import { bootstrapCoursesList } from '../../courses-test-data';

describe('Student Preview Builder', () => {
  let props;
  beforeEach(() => {
    const course = bootstrapCoursesList().get('2');
    course.appearance_code = 'college_biology';
    props = {
      courseId: '2',
      planType: 'homework',
      windowImpl: new FakeWindow(),
    };
  });

  it('opens a preview window when clicked', () => {
    const builder = mount(<BuilderPopup {...props} />);
    builder.simulate('click');
    expect(props.windowImpl.open).to.have.been.called;
    expect(props.windowImpl.openedDOM.window.document.body.textContent).toContain(
      'coming soon'
    );
  });

});
