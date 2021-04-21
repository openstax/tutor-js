import { C, ld, ApiMock, waitFor } from '../../helpers';
import Factory from '../../factories';
import PastAssignments from '../../../src/screens/teacher-dashboard/past-assignments';

describe('CourseCalendar Past Assignments listing', function() {
    let course;
    let props = {};
    const planIds = ld.times(10, (id) => id + 1)

    ApiMock.intercept({
        'courses/\\d+/plans': { items: planIds.map((id) => Factory.data('TeacherTaskPlan', { id })) },
    })

    beforeEach(function() {
        course = Factory.course({ is_teacher: true, cloned_from_id: 1 });
        props = {
            course,
            cloningPlanId: '',
        };
    });

    it('lists plans in due date order', async function() {
        expect(course.isCloned).toBe(true);
        const wrapper = mount(<C><PastAssignments {...props} /></C>);
        await waitFor(() => !wrapper.find('PastAssignmentsLoading'))
        wrapper.update()
        const renderedIds = wrapper.find('[data-assignment-id]').map(d => Number(d.props()['data-assignment-id']));
        expect(renderedIds).toEqual(planIds);
        wrapper.unmount()
    });
});
