import UX from '../../../src/screens/task/ux';
import External from '../../../src/screens/task/external';
import { Factory, C, TestRouter, TimeMock } from '../../helpers';

describe('Tasks External URL Screen', () => {
    let props;

    TimeMock.setTo('2017-10-14T12:00:00.000Z');

    beforeEach(() => {
        const task = Factory.studentTask({ stepCount: 1, type: 'external' });
        task.tasksMap = { course: Factory.course() };
        props = {
            ux: new UX({
                task, history: new TestRouter().history, course: Factory.course(),
            }),
        };
    });

    it('matches snapshot', () => {
        expect(<C><External {...props} /></C>).toMatchSnapshot();
    });

    fit('renders link with href', () => {
        const ex = mount(<C><External {...props} /></C>);
        expect(ex).toHaveRendered(`a[href="${props.ux.task.steps[0].external_url}"]`);
        ex.unmount();
    });

    it('marks step as complete when clicked', () => {
        const ex = mount(<C><External {...props} /></C>);
        const [step] = props.ux.task.steps;
        step.save = jest.fn();
        expect(step.isExternalUrl).toBe(true);
        ex.find(`a.btn[href="${step.external_url}"]`).simulate('click');
        expect(step.is_completed).toBe(true);
        expect(step.save).toHaveBeenCalled();
        ex.unmount();
    });
});
