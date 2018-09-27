import { React, SnapShot } from '../helpers/component-testing';
import TutorRouter from '../../../src/helpers/router';
import Courses from '../../../src/models/courses-map';
import TestRouter from '../helpers/test-router';
import COURSE from '../../../api/user/courses/1.json';
import Handlers from '../../../src/components/error-monitoring/handlers';
jest.mock('../../../src/helpers/router');
const COURSE_ID = '1';

const Wrapper = props => <span>
  {props.body}
</span>;

function error(code) {
  return { data: { errors: [ { code } ] } };
}

describe('Error monitoring: handlers', () => {
  let context;
  let course;

  beforeEach(() => {
    Courses.bootstrap([COURSE], { clear: true });
    course = Courses.get(COURSE_ID);
    TutorRouter.currentParams.mockReturnValue({ courseId: COURSE_ID });
    TutorRouter.makePathname.mockReturnValue('/go/to/dash');
    context = {
      router: new TestRouter,
    };
  });


  it('renders default if code isnt recognized', function() {
    context.error = {
      status: 500, statusMessage: '500 Error fool!', config: {},
    };
    const attrs = Handlers.forError(error`blarg`, context);
    expect(attrs.title).to.include('Server Error');
    const wrapper = shallow(<Wrapper body={attrs.body} />);
    expect(wrapper.find('ServerErrorMessage')).to.have.length(1);
  });

  it('renders not started message', function() {
    const attrs = Handlers.forError(error`course_not_started`, context);
    expect(attrs.title).to.include('Future');
    const wrapper = shallow(<Wrapper body={attrs.body} />);
    expect(wrapper.text()).to.include('not yet started');
    attrs.onOk();
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', { courseId: COURSE_ID });
    expect(context.router.history.push).toHaveBeenCalledWith('/go/to/dash');
  });

  it('renders course ended message', function() {
    const attrs = Handlers.forError(error`course_ended`, context);
    expect(attrs.title).to.include('Past');
    const wrapper = shallow(<Wrapper body={attrs.body} />);
    expect(wrapper.text()).to.include('course ended');
    attrs.onOk();
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', { courseId: COURSE_ID });
    expect(context.router.history.push).toHaveBeenCalledWith('/go/to/dash');
  });

  it('renders exercises not found', function() {
    const attrs = Handlers.forError(error`no_exercises`, context);
    expect(attrs.title).to.include('No exercises are available');
    const wrapper = shallow(<Wrapper body={attrs.body} />);
    expect(wrapper.text()).to.include('no problems to show');
    attrs.onOk();
    expect(TutorRouter.makePathname).toHaveBeenCalledWith('dashboard', { courseId: COURSE_ID });
    expect(context.router.history.push).toHaveBeenCalledWith('/go/to/dash');
  });

  it('renders nothing for payment_overdue', function() {
    expect(Handlers.forError(error`payment_overdue`, context)).toBeNull();
  });
});
