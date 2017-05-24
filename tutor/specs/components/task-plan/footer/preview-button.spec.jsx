import { SnapShot } from '../../helpers/component-testing';
import Preview from '../../../../src/components/task-plan/footer/preview-button';

describe('Task Plan Builder: Preview button', () => {

  let props;
  beforeEach(() => {
    props = {
      planType: 'reading',
      isWaiting: false,
      isNew: true,
      courseId: '1',
    };
  });

  it('renders when plan is new and not waiting', () => {
    const btn = shallow(<Preview {...props} />);
    expect(btn.html()).not.toBeNull();
    btn.setProps({ isWaiting: true });
    expect(btn.html()).toBeNull();
    btn.setProps({ isWaiting: false, isNew: false });
    expect(btn.html()).toBeNull();
    btn.setProps({ isWaiting: false, isNew: true });
    expect(btn.html()).not.toBeNull();
    btn.setProps({ planType: 'external' });
    expect(btn.html()).toBeNull();
  });

  it('matches snapshot', function() {
    expect(
      SnapShot.create(<Preview {...props} />).toJSON()
    ).toMatchSnapshot();
  });

});
