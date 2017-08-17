import { SnapShot } from './helpers/component-testing';

import Enroll from '../../src/components/enroll';

import EnzymeContext from './helpers/enzyme-context';
import Router from '../../src/helpers/router';
import EnrollModel from '../../src/models/course/enroll';
jest.mock('../../src/helpers/router');
jest.mock('../../src/models/course/enroll');

describe('Student Enrollment', () => {
  let params, context;

  beforeEach(() => {
    params = { courseId: '1' };
    context = EnzymeContext.build();
    Router.currentParams.mockReturnValue(params);
    Router.makePathname = jest.fn((name) => name);
  });

  it('loads when mounted', () => {
    EnrollModel.prototype.isLoading = true;
    const enroll = shallow(<Enroll />, context);
    expect(enroll).toHaveRendered('OXFancyLoader');
    EnrollModel.prototype.isLoading = false;
    enroll.setState({});
    expect(enroll).not.toHaveRendered('OXFancyLoader');
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(<Enroll />).toJSON()).toMatchSnapshot();
  });

  it('submits with student id when form is clicked', () => {
    const enroll = mount(<Enroll />, context);
    enroll.find('input').get(0).value = '411';
    enroll.find('.btn-primary').simulate('click');
    expect(enroll.instance().enrollment.student_identifier).toEqual('411');
    expect(enroll.instance().enrollment.confirm).toHaveBeenCalled();
  });

  it('redirects on success', () => {
    EnrollModel.prototype.isComplete = true;
    EnrollModel.prototype.courseId = 12;
    const enroll = shallow(<Enroll />, context);
    expect(enroll).toHaveRendered('Redirect[to="dashboard"]');
  });

  it('redirects when already a member', () => {
    EnrollModel.prototype.isComplete = true;
    EnrollModel.prototype.courseId = null;
    const enroll = shallow(<Enroll />, context);
    expect(enroll).toHaveRendered('Redirect[to="myCourses"]');
  });

  it('blocks teacher enrollment', () => {
    EnrollModel.prototype.isTeacher = true;
    expect(SnapShot.create(<Enroll />).toJSON()).toMatchSnapshot();
    const enroll = shallow(<Enroll />, context);
    Router.makePathname = jest.fn(() => '/courses');
    enroll.find('Button').simulate('click');
    expect(Router.makePathname).toHaveBeenCalledWith('myCourses');
    expect(context.context.router.transitionTo).to.have.been.calledWith({ pathname: '/courses' });
  });

});
