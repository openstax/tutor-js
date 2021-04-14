import { Course, PastTaskPlans } from '../../../../src/models' // /task-plans/teacher/past';
import { Factory, fetchMock } from '../../../helpers'


describe(PastTaskPlans, () => {
    let course!: Course;

    beforeEach(() => {
        course = Factory.course({ is_teacher: true });
        Factory.pastTaskPlans({ course, type: 'pastTaskPlans' });
    });

    it('fetches using past course id', async () => {
        course.cloned_from_id = null;
        expect(course.isCloned).toBe(false);
        fetchMock.mockResponseOnce(JSON.stringify({ items: [{ id: 1234 }] }))
        course.pastTaskPlans.fetch()
        expect(fetchMock).not.toHaveBeenCalled()

        course.cloned_from_id = 123;
        expect(course.isCloned).toBe(true);
        await course.pastTaskPlans.fetch()
        expect(fetchMock).toHaveBeenCalled()
        expect(course.pastTaskPlans.get(1234)).toBeDefined()
    });

});
