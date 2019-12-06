import UX from '../../../src/screens/task/ux';
import ReadingNavbar from '../../../src/screens/task/reading-navbar';
import { TestRouter, Factory, C, ld, TimeMock } from '../../helpers';

describe('Homework Breadcrumbs Component', () => {
  let props;
  let task;
  let history;

  TimeMock.setTo('2017-10-14T12:00:00.000Z');
  beforeEach(() => {
    task = Factory.studentTask({ stepCount: 10, type: 'reading' });
    history = new TestRouter({
      push: (url) => {
        props.ux.goToStep(Number(ld.last(url.split('/'))) - 1, false);
      },
      location: { pathname: '' },
    }).history;
    props = {
      unDocked: true,
      ux: new UX({ task, history, course: Factory.course() }),
    };
  });

  it('displays progress', () => {
    const rp = mount(<C><ReadingNavbar {...props} /></C>);
    expect(props.ux.steps).toHaveLength(12);
    rp.update();
    expect(rp).toHaveRendered('ProgressBar[now=0]');
    props.ux.goForward();
    rp.update();
    expect(rp).toHaveRendered('ProgressBar[now=8]');
    rp.update();
    props.ux.goBackward();
    rp.update();
    expect(rp).toHaveRendered('ProgressBar[now=0]');
    rp.unmount();
  });

});
