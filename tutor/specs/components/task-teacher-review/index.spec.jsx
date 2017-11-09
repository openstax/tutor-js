import { Wrapper, SnapShot } from '../helpers/component-testing';
import TaskPlan from '../../../src/models/task-plan/teacher';
import EnzymeContext from '../helpers/enzyme-context';
import planData from '../../../api/plans/1.json';
import statsData from '../../../api/plans/1/review.json';
import { bootstrapCoursesList } from '../../courses-test-data';
import TaskTeacherReview from '../../../src/components/task-teacher-review';
import Exercise from '../../../src/components/task-teacher-review/exercise';
import TeacherTaskPlans from '../../../src/models/course/task-plans';

describe('Task Teacher Review', () => {
  let plan;
  let course;
  let props;

  beforeEach(() => {
    course = bootstrapCoursesList().get(2);
    plan = course.taskPlans.withPlanId(1);
    plan.fetch = jest.fn(() => Promise.resolve());
    plan.onApiRequestComplete({ data: planData });
    plan.analytics.fetch = jest.fn();
    plan.analytics.onApiRequestComplete({ data: statsData });
    course.periods[0].id = plan.analytics.stats[0].period_id;
    props = {
      params: {
        courseId: course.id,
        id: plan.id,
      },
    };
  });

  it('renders and matches snapshot', () => {
    const review = mount(<TaskTeacherReview {...props} />, EnzymeContext.build());
    expect(review).toHaveRendered('Stats');
    expect(review).toHaveRendered('Review');
    expect(review).toHaveRendered('Breadcrumbs');
    review.unmount();
  });

});
