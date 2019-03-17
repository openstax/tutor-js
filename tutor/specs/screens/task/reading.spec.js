import UX from '../../../src/screens/task/ux';
import Reading from '../../../src/screens/task/reading';
import { Factory } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props;

  beforeEach(() => {
    const task = Factory.studentTasks({
      count: 1,
      attributes: { type: 'reading' },
    }).array[0];

    props = {
      ux: new UX({ task }),
    };
  });

  it('render as loading', () => {
    props.ux.currentStep.api.requestsInProgress.set(1, {});
    const r = mount(<Reading {...props} />);
    expect(r).toHaveRendered('ContentLoader');
    r.unmount();
  });

  fit('renders content', () => {
    props.ux.currentStep.onLoaded({
      Factory.bot.create('StudentTaskReadingStepContent'),
    })
    props.ux.currentStep.isFetched = true;
    const r = mount(<Reading {...props} />);
    expect(r).toHaveRendered('ContentLoader');
    r.unmount();
  })

});
