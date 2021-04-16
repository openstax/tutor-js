import Failure from '../../../../src/screens/task/step/failure';
import { StudentTask as Task, StudentTaskStep as Step, Raven } from '../../../../src/models'
import { C, hydrateModel, stimulateApiError } from '../../../helpers';
jest.mock('../../../../src/models/app/raven');


describe('Task Failure', () => {
    let props;

    beforeEach(() => {
        props = {
            task: hydrateModel(Task, { id: 4321 }),
            step: hydrateModel(Step, { id: 1234 }),
        };
    });

    it('matches snapshot', () => {
        expect(<Failure {...props} />).toMatchSnapshot();
    });

    it('logs step message', () => {
        const fail = mount(<C><Failure {...props} /></C>);
        expect(Raven.log).toHaveBeenCalledWith(
            expect.stringContaining('Failed to save assignment step'),
            { stepId: 1234, taskId: 4321 },
        );
        fail.unmount();
    });

    fit('logs task message', () => {
        stimulateApiError(props.task, 'fetchStudentTask', 'a error', {
            code: 'not_valid_task',
            message: 'no!',
        })

        const fail = mount(<C><Failure {...props} /></C>);

        expect(Raven.log).toHaveBeenCalledWith(
            expect.stringContaining('Failed to load assignment'),
            { stepId: 1234, taskId: 4321 },
        );
        fail.unmount();
    });

});
