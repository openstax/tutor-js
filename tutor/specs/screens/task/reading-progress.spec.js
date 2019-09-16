import UX from '../../../src/screens/task/ux';
import { ReadingProgress } from '../../../src/screens/task/reading-progress';
import { Factory, C, TestRouter, TimeMock } from '../../helpers';

describe('Homework Breadcrumbs Component', () => {
  let props;
  let task;

  TimeMock.setTo('2017-10-14T12:00:00.000Z');
  beforeEach(() => {
    task = Factory.studentTask({ stepCount: 10, type: 'reading' });
    props = {
      unDocked: true,
      ux: new UX({ task, history: new TestRouter().history, course: Factory.course() }),
    };
  });

  it('displays progress', () => {
    const rp = mount(<C><ReadingProgress {...props} /></C>);
    expect(props.ux.steps).toHaveLength(12);
    expect(rp).toHaveRendered('ProgressBar[now=0]');
    props.ux.goForward();
    expect(rp).toHaveRendered('ProgressBar[now=8]'); // 1 / 12 * 100 rounded
    props.ux.goForward();
    expect(rp).toHaveRendered('ProgressBar[now=17]');
    props.ux.goBackward();
    props.ux.goBackward();
    expect(rp).toHaveRendered('ProgressBar[now=0]');
    rp.unmount();
  });

});
