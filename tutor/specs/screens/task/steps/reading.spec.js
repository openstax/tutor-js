import Reading from '../../../../src/screens/task/step/reading';
import { Factory, FactoryBot, FakeWindow, TestRouter } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

//jest.mock('../../../../src/screens/task/ux');
jest.mock('../../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Reading Tasks Screen', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'reading', stepCount: 1 }); // .steps[0];
    // step.onLoaded({
    //   data: Factory.bot.create('StudentTaskReadingStepContent'),
    // });
    const ux = new UX({
      task,
      course: Factory.course(),
      router: new TestRouter(),
    });
    // Object.assign(ux, {
    //   currentStep: step,
    //   course: Factory.course(),
    //   page: step.content.page,
    // });
    props = {
      ux,
      windowImpl: new FakeWindow,
    };
  });

  it('matches snapshot', () => {
    expect.snapshot(<Reading {...props} />).toMatchSnapshot();
  });


  it('renders media', () => {
//    console.log(props.ux.currentStep.content.page)
//    console.log(props.step.content.page)
  //  return
    const r = mount(<Reading {...props} />);
    console.log(r.debug())
    expect(r).toHaveRendered('BookPage');
    r.unmount();
  });

});
