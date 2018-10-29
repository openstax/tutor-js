import { Wrapper, SnapShot } from 'helpers';
import EnzymeContext from '../helpers/enzyme-context';
import Course from '../../../src/models/course';
import CourseUseTips from '../../../src/components/onboarding/course-use-tips';

import { observable } from 'mobx';


describe('Course Use Tips', () => {

  let ux, course, props;

  beforeEach(() => {
    course = new Course({ appearance_code: 'biology', id: 42 });
    ux = observable.object({ course });
    props = {
      ux,
      onDismiss: jest.fn(),
    };
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(
      <Wrapper _wrapped_component={CourseUseTips} {...props} />
    ).toMatchSnapshot();
  });

  it('has link to help', async () => {
    const wrapper = shallow(<CourseUseTips {...props} />, EnzymeContext.build());
    expect(wrapper).toHaveRendered('a.best-practices');
    course.appearance_code = 'gibberish';
    expect(wrapper).not.toHaveRendered('a.best-practices');
  });

  it('dismisses on btn click', () => {
    const tips = shallow(<CourseUseTips {...props} />, EnzymeContext.build());
    tips.find('Footer Button').simulate('click');
    expect(props.onDismiss).toHaveBeenCalled();
  });

});
