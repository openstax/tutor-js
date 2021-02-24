import { Factory, ld } from '../../helpers';
import * as M from '../../../src/screens/task/ux-task-manipulations';

jest.mock('shared/model/ui-settings', () => ({
    get() { return false; },
}));

describe('Task Manipulations', () => {

    function createTask({ type }) {
        const task = Factory.studentTask({ type, stepCount: 10 });
        return { task, steps: task.steps };
    }

    it('inserts two-step before MPQ', () => {
        const t = createTask({ type: 'homework' });
        t.steps.forEach(s => s.formats = []);
        t.steps[7].formats = ['free-response', 'multiple-choice'];
        t.steps[7].uid = t.steps[6].uid;
        const { steps } = M.insertValueProp(t);
        expect(steps[6]).toMatchObject({ type: 'two-step-intro' });
        expect(steps.length).toEqual(11);
    });

    it('insertIndividiualReview', () => {
        const t = createTask({ type: 'reading' });
        t.steps[7].labels = ['review'];
        const { steps } = M.insertIndividiualReview(t);
        expect(steps[7]).toMatchObject({ type: 'individual-review-intro' });
        expect(steps.length).toEqual(11);
    });

    it('insertIndividiualReview before placeholders', () => {
        const t = createTask({ type: 'homework' });
        t.steps[7].type = 'placeholder';
        const { steps } = M.insertIndividiualReview(t);
        expect(steps[7]).toMatchObject({ type: 'individual-review-intro' });
        expect(steps.length).toEqual(11);
    });

    it('value prop card', () => {
        const t = createTask({ type: 'homework' });
        const stepI = ld.findIndex(t.steps, { isTwoStep: true });
        expect(stepI).not.toEqual(-1);
        const { steps } = M.insertValueProp(t);
        expect(steps[stepI]).toMatchObject({ type: 'two-step-intro' });
        expect(steps.length).toEqual(11);
    });

    it('inserts end', () => {
        const t = createTask({ type: 'homework' });
        const { steps } = M.insertEnd(t);
        expect(steps[steps.length - 1]).toMatchObject({ type: 'end' });
    });

});
