import UX from '../../../src/screens/task/ux';
import Reading from '../../../src/screens/task/reading';
import { TestRouter, Factory, FakeWindow, ld, TimeMock, C } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props, history;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'reading' });
    task.tasksMap = { course: Factory.course() }
    history = new TestRouter({
      push: (url) => {
        props.ux.goToStepId(ld.last(url.split('/')), false);
      },
    }).history;
    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({
        stepId: task.steps[0].id,
        task, history,
        course: Factory.course(),
      }),
    };
  });

  it('matches snapshot', () => {
    expect(<C><Reading {...props} /></C>).toMatchSnapshot();
  });

  it('render as loading', () => {
    props.ux.goToStepId(3);
    props.ux.currentStep.api.reset();
    expect(props.ux.currentStep.needsFetched).toBeTruthy();
    const r = mount(<C><Reading {...props} /></C>);
    expect(r).toHaveRendered('ContentLoader');
    r.unmount();
  });

  it('renders content', () => {
    const r = mount(<C><Reading {...props} /></C>);

    r.unmount();
  });

  it('renders value props', () => {
    props.ux.task.steps[1].formats = ['free-response', 'multiple-choice'];
    props.ux._stepId = props.ux.steps.find(s=>s.type === 'two-step-intro').id;
    const r = mount(<C><Reading {...props} /></C>);
    expect(props.ux.currentStep.type).toEqual('two-step-intro');
    expect(r).toHaveRendered('TwoStepValueProp');
    r.unmount();
  });

  it('pages through steps', () => {
    const pr = mount(<C><Reading {...props} /></C>);
    expect(pr).toHaveRendered('a.paging-control.prev')
    expect(pr).toHaveRendered('a.paging-control.next[disabled=false]');
    pr.find('a.paging-control.next').simulate('click');
    pr.find('a.paging-control.next').simulate('click');
    pr.unmount();
  });

});
