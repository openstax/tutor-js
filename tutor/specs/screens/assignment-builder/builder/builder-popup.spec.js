import FakeWindow from 'shared/specs/helpers/fake-window';
import BuilderPopup from '../../../../src/screens/assignment-builder/footer/builder-popup';
import { bootstrapCoursesList } from '../../../courses-test-data';

xdescribe('Student Preview Builder', () => {
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

  it('opens a preview window when clicked', async () => {
    const wrapper = mount(<BuilderPopup {...props} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    wrapper.simulate('click');
    expect(props.windowImpl.open).toHaveBeenCalled();
    expect(props.windowImpl.openedDOM.window.document.body.textContent).toContain(
      'coming soon'
    );
  });

  it('can re-open popup', () => {
    const builder = mount(<BuilderPopup {...props} />);
    expect(builder.instance().isOpen).toEqual(false);
    builder.simulate('click');
    expect(props.windowImpl.open).toHaveBeenCalledTimes(2);

    expect(builder.instance().isOpen).toEqual(true);
    // jsdom doesn't call this :(
    props.windowImpl.openedDOM.window.onbeforeunload();

    props.windowImpl.openedDOM.window.close();
    expect(builder.instance().isOpen).toEqual(false);
    builder.simulate('click');

    expect(props.windowImpl.open).toHaveBeenCalledTimes(3);
  });

});
