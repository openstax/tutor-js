import { extendObservable as mockExtendObservable } from 'mobx';
import EmptyPanel from '../../../src/screens/student-dashboard/empty-panel';
import Factory from '../../factories';

jest.mock('../../../src/models/task-plans/student', function() {
  return {
    __esModule: true, // this property makes it work
    default: 'mockedDefaultExport',
    StudentTaskPlans: function StudentTaskPlans() {
      mockExtendObservable(this, {
        isPendingTaskLoading: false,
        api: {
          isPendingInitialFetch: false,
        },
      });
    },
  };
});

describe('Empty Panel', () => {

  let props;

  beforeEach(() => {

    props = {
      message: 'Yes, I be empty',
      title: 'upcoming',
      className: 'updog',
      course: Factory.course(),
      spinner: true,
    };
  });


  it('shows the various states', () => {
    const panel = mount(<EmptyPanel {...props} />);
    expect(panel.text()).toContain('I be empty');
    props.course.studentTaskPlans.api.isPendingInitialFetch = true;
    expect(panel.text()).toContain('Fetching assignments for your course');
    expect(panel.text()).not.toContain('This can take up to 10 minutes');
    props.course.studentTaskPlans.isPendingTaskLoading = true;
    expect(panel.text()).toContain('This can take up to 10 minutes');
  });

});
