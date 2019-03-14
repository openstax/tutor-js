//import UX from '../../../src/screens/task/ux';
import Reading from '../../../../src/screens/task/step/reading';
import { Factory, FactoryBot, FakeWindow } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

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
    props = {
      ux,
      windowImpl: new FakeWindow,
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<Reading {...props} />).toMatchSnapshot();
  });

  // const r = mount(<Reading {...props} />);
  // // console.log(r.debug());
  // r.unmount();
  //});

});
