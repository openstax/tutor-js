import Exercise from '../../../../src/screens/task/step/exercise';
import { Factory, FactoryBot, FakeWindow } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);


describe('Exercise Tasks Screen', () => {
  let props;
  let step;
  beforeEach(() => {
    step = Factory.studentTaskStep({
      type: 'exercise',
    });
    step.onLoaded({
      data: FactoryBot.create('StudentTaskExerciseStepContent'),
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
    console.log(
      step.content.questions
    )
    const ex = mount(<Exercise {...props} />)
    console.log(ex.debug())
    //    expect.snapshot(<Exercise {...props} />).toMatchSnapshot();
  });

  // const r = mount(<Reading {...props} />);
  // // console.log(r.debug());
  // r.unmount();
  //});

});
