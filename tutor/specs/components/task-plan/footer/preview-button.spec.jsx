import { SnapShot } from '../../helpers/component-testing';
import Preview from '../../../../src/components/task-plan/footer/preview-button';

describe('Task Plan Builder: Preview button', () => {

  it('renders when plan is new and not waiting', () => {
    const btn = shallow(<Preview courseId='1' isWaiting={false} isNew={true} />);
    expect(btn.html()).not.toBeNull();
    btn.setProps({ isWaiting: true });
    expect(btn.html()).toBeNull();
    btn.setProps({ isWaiting: false, isNew: false });
    expect(btn.html()).toBeNull();
    btn.setProps({ isWaiting: false, isNew: true });
    expect(btn.html()).not.toBeNull();
  });

  it('matches snapshot', function() {
    expect(
      SnapShot.create(<Preview courseId='1' isWaiting={false} isNew={true} />).toJSON()
    ).toMatchSnapshot();
  });

});
