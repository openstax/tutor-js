//import UX from '../../../src/screens/task/ux';
import Reading from '../../../../src/screens/task/step/reading';
import { Factory, FactoryBot } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

jest.mock('../../../../src/screens/task/ux');

describe('Reading Tasks Screen', () => {
  let props;

  beforeEach(() => {
    const step = Factory.studentTaskStep({
      type: 'reading',
    });
    step.onLoaded({
      data: FactoryBot.create('StudentTaskReadingStepContent'),
    });
    const ux = new UX();
    ux.course = Factory.course();
    ux.currentStep = step;
    props = { ux };
  });

  it('render', () => {
    // console.log(props.step.content.page)
    // return
    const r = mount(<Reading {...props} />);
    console.log(r.debug());
    r.unmount();
  });

});
