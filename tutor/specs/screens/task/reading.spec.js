import UX from '../../../src/screens/task/ux';
import Reading from '../../../src/screens/task/reading';
import { Factory, FakeWindow } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'reading' },
    }).array[0];

    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task }),
    };
  });

  it('render as loading', () => {
    props.ux.currentStep.api.requestsInProgress.set(1, {});
    const r = mount(<Reading {...props} />);
    expect(r).toHaveRendered('ContentLoader');
    r.unmount();
  });

  it('renders content', () => {
    props.ux.currentStep.onLoaded({
      data: Factory.bot.create('StudentTaskReadingStepContent'),
    })
    const r = mount(<Reading {...props} />);
    expect(r).not.toHaveRendered('ContentLoader');
    r.unmount();
  })

});
