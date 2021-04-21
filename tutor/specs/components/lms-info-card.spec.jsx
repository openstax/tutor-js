import { Factory, hydrateModel, runInAction } from '../helpers';
import { TeacherTaskPlan, currentCourses } from '../../src/models';
import LmsInfo from '../../src/components/lms-info-card';

jest.mock('../../src/models/courses-map');

describe('LmsInfo Component', function() {
    let props;
    let course;

    beforeEach(function() {
        course = Factory.course();
        currentCourses.get.mockImplementation(() => course);
        props = {
            courseId: course.id.toString(),
            onBack: jest.fn(),
            plan: hydrateModel(TeacherTaskPlan, {
                id: '2',
                title: 'A test plan',
                description: '',
                shareable_url: '/foo/a-test-plan',
                tasking_plans: [{
                    opens_at: '2012-01-01',
                    due_at: '2012-02-01',
                    closes_at: '2012-02-01',
                }],
            }),
        };
    });

    it('renders NO LINK when preview course', async () => {
        runInAction(() => { course.is_preview = true });
        const wrapper = mount(<LmsInfo {...props} />);
        expect(wrapper).toHaveRendered('.lms-info.preview');
    });

    it('renders with message even when there is no url', async function() {
        runInAction(() => props.plan.analytics.shareable_url = '');
        const wrapper = mount(<LmsInfo {...props} />);
        expect(wrapper.html()).toBeTruthy();
    });

    it('matches snapshot', () => {
        expect.snapshot(<LmsInfo {...props} />).toMatchSnapshot();
    });


});
