import { Factory, FactoryBot, C } from '../../helpers';
import planData from '../../../api/plans/1.json';
import TaskTeacherReview from '../../../src/screens/teacher-review-metrics';
import Courses from '../../../src/models/courses-map';

describe('Task Teacher Review', () => {
    let plan;
    let course;
    let props;


    beforeEach(() => {
        course = Factory.course();
        Factory.teacherTaskPlans({ course });
        Courses.set(course.id, course);
        plan = course.teacherTaskPlans.array[0];
        plan.fetch = jest.fn(() => Promise.resolve());
        plan.onApiRequestComplete({ data: planData });
        plan.analytics.fetch = jest.fn();
        plan.analytics.api.requestCounts.read = 1;
        plan.analytics.onApiRequestComplete({
            data: FactoryBot.create('TaskPlanStat', { course }),
        });

        props = {
            params: {
                courseId: course.id,
                id: plan.id,
            },
        };
    });

    it('renders and matches snapshot', () => {
        const wrapper = mount(<C><TaskTeacherReview {...props} /></C>);
        expect(wrapper).toHaveRendered('Stats');
        expect(wrapper).toHaveRendered('Review');
        expect(wrapper).toHaveRendered('Breadcrumbs');
        wrapper.unmount();
    });

});
