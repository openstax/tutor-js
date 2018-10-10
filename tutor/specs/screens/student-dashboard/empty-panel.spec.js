import EmptyPanel from '../../../src/screens/student-dashboard/empty-panel';
import { observable as mockObservable } from 'mobx';
import { Testing, _, React } from '../../components/helpers/component-testing';
import Factory from '../../factories';

jest.mock('../../../src/models/student-tasks', () => ({
  forCourse() {
    return mockObservable({
      isPendingTaskLoading: false,
      api: {
        isPending: false,
      },
    });
  },
}));


describe('Empty Panel', () => {

  let props;

  beforeEach(() => {

    props = {
      message: 'Yes, I be empty',
      title: 'upcoming',
      className: 'updog',
      course: Factory.course(),
    };
  });


  it('shows the various states', () => {
    const panel = mount(<EmptyPanel {...props} />);
    expect(panel.text()).toContain('I be empty');
    props.course.studentTasks.api.isPending = true;
    expect(panel.text()).toContain('Fetching assignments for your course');
    expect(panel.text()).not.toContain('This can take up to 10 minutes');
    props.course.studentTasks.isPendingTaskLoading = true;
    expect(panel.text()).toContain('This can take up to 10 minutes');
  });

});
