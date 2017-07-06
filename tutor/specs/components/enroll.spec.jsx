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
    Router.makePathname.mockReturnValue('go-to-dash');
  });

  it('loads when mounted', () => {
    EnrollModel.prototype.isPending = true;
    const enroll = shallow(<Enroll />, context);
    expect(enroll).toHaveRendered('OXFancyLoader');
    EnrollModel.prototype.isPending = false;
    enroll.setState({});
    expect(enroll).not.toHaveRendered('OXFancyLoader');
  });

  it('renders and matches snapshot', () => {
    EnrollModel.prototype.isPending = false;
    expect(SnapShot.create(<Enroll />).toJSON()).toMatchSnapshot();
  });

  it('submits with student id when form is clicked', () => {
    EnrollModel.prototype.isPending = false;
    const enroll = mount(<Enroll />, context);
    enroll.find('input').get(0).value = '411';
    enroll.find('.btn-primary').simulate('click');
    expect(enroll.instance().enrollment.student_identifier).toEqual('411');
    expect(enroll.instance().enrollment.confirm).toHaveBeenCalled();
  });

  it('redirects on success', () => {
    EnrollModel.prototype.isPending = false;
    EnrollModel.prototype.isComplete = true;
    const enroll = shallow(<Enroll />, context);
    expect(enroll).toHaveRendered('Redirect');
  });
});
