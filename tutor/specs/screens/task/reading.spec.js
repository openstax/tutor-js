import UX from '../../../src/screens/task/ux';
import Reading from '../../../src/screens/task/reading';
import { TestRouter, Factory, FakeWindow, ld, TimeMock, C } from '../../helpers';

describe('Reading Tasks Screen', () => {
  let props, history;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({ type: 'reading' });
    history = new TestRouter({
      push: (url) => {
        props.ux.goToStep(Number(ld.last(url.split('/'))) - 1, false);
      },
    }).history;
    props = {
      windowImpl: new FakeWindow(),
      ux: new UX({ task, history, course: Factory.course() }),
    };
    history = new TestRouter({
      push: (url) => {
        props.ux.goToStep(ld.last(url.split('/')), false);
      },
    }).history;
  });

  it('matches snapshot', () => {
    expect(<C><Reading {...props} /></C>).toMatchSnapshot();
  });

  it('render as loading', () => {
    props.ux.goToStep(2);
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
    props.ux._stepIndex = props.ux.steps.findIndex(s=>s.type === 'two-step-intro');
    const r = mount(<C><Reading {...props} /></C>);
    expect(props.ux.currentStep.type).toEqual('two-step-intro');
    expect(r).toHaveRendered('TwoStepValueProp');
    r.unmount();
  });


  it('switches steps as needed when task reloads', () => {
    jest.useFakeTimers();
    props.ux.task.steps = [
      Factory.bot.create('StudentTaskStep', { type: 'reading' }),
      Factory.bot.create('StudentTaskStep', { type: 'placeholder' }),
    ];

    const r = mount(<C><Reading {...props} /></C>);
    expect(props.ux.canGoForward).toBe(true);
    expect(props.ux._stepIndex).toEqual(0)
    props.ux.goForward();
    expect(r).toHaveRendered('IndividualReview');

    expect(r).toHaveRendered('ContinueBtn button[disabled=true]');
    jest.runAllTimers();
    expect(r).toHaveRendered('ContinueBtn button[disabled=false]');

    expect(props.ux._stepIndex).toEqual(1)
    props.ux.goForward();
    expect(props.ux._stepIndex).toEqual(2)

    expect(r).toHaveRendered('LoadingCard');

    props.ux.currentStep.api.requestCounts.read = 1;

    expect(r).toHaveRendered('PlaceHolderTaskStep');

    props.ux.task.onFetchComplete({
      data: {
        steps: [
          Factory.bot.create('StudentTaskStep', { type: 'reading' }),
          Factory.bot.create('StudentTaskStep', { type: 'exercise', formats: ['free-response', 'multiple-choice'] }),
        ],
      },
    });

    // the new step won't have been loaded
    expect(r).toHaveRendered('LoadingCard');
    props.ux.currentStep.onLoaded({
      data: Factory.bot.create('StudentTaskExerciseStepContent'),
    });
    props.ux.currentStep.api.requestCounts.read = 1;
    expect(r).toHaveRendered('ExerciseTaskStep');
    r.unmount();
  });

  it('pages through steps', () => {
    const pr = mount(<C><Reading {...props} /></C>);
    expect(pr).toHaveRendered('a.paging-control.prev[disabled=true]');
    expect(pr).toHaveRendered('a.paging-control.next[disabled=false]');
    pr.find('a.paging-control.next').simulate('click');
    pr.find('a.paging-control.next').simulate('click');
    expect(pr).toHaveRendered('a.paging-control.next[disabled=true]');
    expect(pr).toHaveRendered('a.paging-control.prev[disabled=false]');
    pr.unmount();
  });

});
