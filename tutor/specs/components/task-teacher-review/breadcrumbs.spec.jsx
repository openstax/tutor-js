import { SnapShot, Wrapper} from '../helpers/component-testing';
import TaskPlan from '../../../src/models/task-plan/teacher';

import planData from '../../../api/plans/1.json';
import statsData from '../../../api/plans/1/review.json';

import Breadcrumbs from '../../../src/components/task-teacher-review/breadcrumbs';
import Router from '../../../src/helpers/router';
import EnzymeContext from '../helpers/enzyme-context';

jest.mock('../../../src/helpers/router');

describe('Task Teacher Review: Breadcrumbs', function() {
  let plan;
  let props;

  beforeEach(() => {
    plan = new TaskPlan();
    plan.onApiRequestComplete({ data: planData });
    plan.analytics.onApiRequestComplete({ data: statsData });
    Router.makePathname.mockReturnValue('/bread');
    props = {
      taskPlan: plan,
      scrollToStep: jest.fn(),
      stats: plan.analytics.stats[0],
      title: 'Title',
      courseId: '1',
    };
  });

  it('renders and matches snapshot', () => {
    const bc = shallow(<Breadcrumbs {...props} />);
    expect(bc.find('BreadcrumbStatic')).toHaveLength(6);
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Breadcrumbs} noReference={true} {...props} />).toJSON()
    ).toMatchSnapshot();
  });

  it('attempts to scroll when click', function() {
    const bc = mount(<Breadcrumbs {...props} />, EnzymeContext.build());
    bc.find('Breadcrumb').first().simulate('click');
    expect(props.scrollToStep).toHaveBeenCalled();
  });

});
