import Failure from '../../../../src/screens/task/step/failure';
import Task from '../../../../src/models/student-tasks/task';
import Step from '../../../../src/models/student-tasks/step';
import Raven from '../../../../src/models/app/raven';
jest.mock('../../../../src/models/app/raven');


describe('Task Failure', () => {
  let props;

  beforeEach(() => {
    props = {
      task: new Task(),
      step: new Step({ id: 1234 }),
    };
  });

  it('matches snapshot', () => {
    expect(<Failure {...props} />).toMatchSnapshot();
  });

  it('logs step message', () => {
    const fail = mount(<Failure {...props} />);
    expect(Raven.log).toHaveBeenCalledWith(
      expect.stringContaining('Failed to save assignment step id: 1234')
    );
    fail.unmount();
  });

  it('logs task message', () => {
    props.task.api.errors = { foo: 'bar', last: { config: { method: 'get' } } };
    const fail = mount(<Failure {...props} />);

    expect(Raven.log).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load assignment, errors: Foo bar')
    );
    fail.unmount();
  });

});
