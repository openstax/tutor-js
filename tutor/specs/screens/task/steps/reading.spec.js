import Reading from '../../../../src/screens/task/step/reading';
import { Factory, FakeWindow, TestRouter, TimeMock } from '../../../helpers';
import UX from '../../../../src/screens/task/ux';

jest.mock('../../../../src/components/book-page', () => (({ children }) =>
  <div>{children}</div>
));

describe('Reading Tasks Screen', () => {
  let props;
  TimeMock.setTo('2017-10-14T12:00:00.000Z');

  beforeEach(() => {
    const task = Factory.studentTask({
      type: 'reading', stepCount: 1,
      steps: [ { type: 'reading' } ],
    });
    const ux = new UX({
      task,
      course: Factory.course(),
      history: new TestRouter().history,
    });
    props = {
      ux,
      step: task.steps[0],
      windowImpl: new FakeWindow,
    };
  });


  it('matches snapshot', () => {
    expect.snapshot(<Reading {...props} />).toMatchSnapshot();
  });

});
