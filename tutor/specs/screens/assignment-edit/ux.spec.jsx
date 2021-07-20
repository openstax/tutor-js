import AssignmentUX from '../../../src/screens/assignment-edit/ux';
import { currentExercises } from '../../../src/models'


jest.mock('../../../src/models/exercises');


describe('AssignmentUX', function() {
    const attrs = {
        plan: {
            ensureLoaded: jest.fn(),
            grading_template_id: 1,
            ecosystem_id: 142,
            type: 'homework',
            pageIds: [],
            exercises: [
                { isMultiChoice: true },
                { isMultiChoice: true },
                { isOpenEnded: true },
            ],
        },
        gradingTemplates: {
            ensureLoaded: jest.fn(),
        },
        selectedPageIds: [],
        course: { gradingTemplates: [] },
    };

    it('renders the correct question counts', () => {
        const ux = new AssignmentUX(attrs);
        expect(ux.numMCQs).toBe(2);
        expect(ux.numWRQs).toBe(1);
        expect(ux.numExerciseSteps).toBe(3);
    });

    it('clears exercise cache', async () => {
        const ux = new AssignmentUX();
        await ux.initialize(attrs);
        expect(currentExercises.clear).toHaveBeenCalled();
    });

    it('sends ecosystem id when fetching', async () => {
        const ux = new AssignmentUX();
        await ux.initialize(attrs);
        expect(ux.referenceBook.id).toEqual(142) // should use plan's ecosystem id
        ux.referenceBook.ensureLoaded = jest.fn()
        ux.steps.setIndex('chapters')
        expect(ux.referenceBook.ensureLoaded).toHaveBeenCalled()
        ux.steps.setIndex('questions')
        expect(currentExercises.fetch).toHaveBeenCalledWith(expect.objectContaining({
            ecosystem_id: 142,
        }))
    });

    it('sends the user to the assignment\'s first tasking_plan\'s dueAt when done', async () => {
        const ux = new AssignmentUX()
        attrs['course']['id'] = 42
        attrs['plan'] = {
            tasking_plans: [{ dueAt: { asISODateString: '2021-06-12' } }],
            ensureLoaded: jest.fn(),
            grading_template_id: 42,
        }
        attrs['history'] = { push: jest.fn() }
        await ux.initialize(attrs)
        ux.onComplete()
        expect(ux.history.push).toHaveBeenCalledWith('/course/42/t/month/2021-06-12')
    });

    it('sends the user to the assignment\'s default dueAt month w/o tasking_plans', async () => {
        const ux = new AssignmentUX()
        attrs['course']['id'] = 42
        attrs['plan'] = {
            tasking_plans: [],
            ensureLoaded: jest.fn(),
            grading_template_id: 42,
        }
        attrs['due_at'] = '2021-06-12'
        attrs['history'] = { push: jest.fn() }
        await ux.initialize(attrs)
        ux.onComplete()
        expect(ux.history.push).toHaveBeenCalledWith('/course/42/t/month/2021-06-12')
    });
});
