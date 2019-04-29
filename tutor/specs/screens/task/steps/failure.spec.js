import Failure from '../../../../src/screens/task/step/failure';
import Raven from '../../../../src/models/app/raven';
jest.mock('../../../../src/models/app/raven');


describe('Task Failure', () => {
  let props;

  beforeEach(() => {
    props = {
      task: {
        api: {
          errors: {},
        },
      },
      step: {
        id: 1234,
        api: {
          errors: {},
        },
      },
    };
  });

  it('matches snapshot', () => {
    expect(<Failure {...props} />).toMatchSnapshot();
  });

  it('logs step message', () => {
    const fail = mount(<Failure {...props} />);
    expect(Raven.log).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load assignment step id: 1234')
    );
    fail.unmount();
  });

  it('logs task message', () => {
    props.task.api.hasErrors = true;
    props.task.api.errors = { foo: 'bar' };
    const fail = mount(<Failure {...props} />);
    expect(Raven.log).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load assignment, errors: Foo bar')
    );
    fail.unmount();
  });

});
