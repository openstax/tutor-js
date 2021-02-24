import { StepFooter } from '../../../../src/screens/task/step/footer';
import { Factory, TimeMock, C } from '../../../helpers';

describe('Task Step Footer', () => {
    let props;
    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        const task = Factory.studentTask({ type: 'homework', stepCount: 1 });
        props = {
            course: Factory.course(), step: task.steps[0],
        };
    });

    it('matches snapshot', () => {
        const exf = mount(<C><StepFooter {...props} /></C>);
        expect(exf.debug()).toMatchSnapshot();
        exf.unmount();
    });

});
