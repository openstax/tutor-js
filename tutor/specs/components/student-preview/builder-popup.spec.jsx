import BuilderPopup from '../../../src/components/student-preview/builder-popup'
import FakeWindow from 'shared/specs/helpers/fake-window';

describe('Student Preview Builder', () => {
  let props;
  beforeEach(() => {
    props = {
      courseId:   '1',
      windowImpl: new FakeWindow(),
    };
  });

  it('opens a preview window when clicked', () => {
    const builder = mount(<BuilderPopup {...props} />);
    builder.simulate('click');
    expect(props.windowImpl.open).to.have.been.called
    expect(props.windowImpl.openedDOM.window.document.body.textContent).toContain(
      'coming soon'
    )
  });

});
