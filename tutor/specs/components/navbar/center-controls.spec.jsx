import { EnzymeContext, TimeMock, Factory } from '../../helpers';
import CenterControls from '../../../src/components/navbar/center-controls';

describe('Center Controls', function() {
  let props;

  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    props = {
      course: Factory.course(),
    };
  });

  afterEach(() => {
    CenterControls.currentTaskStep = null;
  });

  it('hides itself by default', () => {
    const cntrl = mount(<CenterControls {...props} />, EnzymeContext.build());
    expect(cntrl.html()).toBeNull();
    cntrl.unmount();
  });

  it('renders milestones link when task is set', () => {
    CenterControls.currentTaskStep = Factory.studentTask({ type: 'reading', stepCount: 1 }).steps[0];
    const cntrl = mount(<CenterControls {...props} />, EnzymeContext.build());
    expect(cntrl).toHaveRendered('MilestonesToggle');
    cntrl.unmount();
  });

  // fit('renders close milestones link when on milestones path', () => {
  //   Router.currentMatch.mockImplementation(() => ({
  //     entry: { name: 'viewTaskStepMilestones' },
  //   }));
  //   props.params.milestones = true;
  //   const cntrl = mount(<CenterControls {...props} />, EnzymeContext.build());
  //   expect(cntrl).toHaveRendered('.milestones-toggle.active');
  // });

});
