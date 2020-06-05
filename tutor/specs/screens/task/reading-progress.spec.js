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
        props.ux.goToStepId(ld.last(url.split('/')), false);
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
    expect(props.ux.steps).toHaveLength(13);
    expect(rp).toHaveRendered('ProgressBar[now=0]');
    props.ux.goForward();
    expect(rp).toHaveRendered('ProgressBar[now=8]');
    props.ux.goBackward();
    expect(rp).toHaveRendered('ProgressBar[now=0]');
    rp.unmount();
  });

});
