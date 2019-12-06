import { R, TimeMock, Factory } from '../../helpers';
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
    const cntrl = mount(<R><CenterControls {...props} /></R>);
    expect(cntrl.html()).toBe('');
    cntrl.unmount();
  });

});
