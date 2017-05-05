import { React, SnapShot } from '../helpers/component-testing';
import SelectType from '../../../src/components/new-course/select-type';
import BuilderUX from '../../../src/models/course/builder-ux';

describe('CreateCourse: Selecting type of course', function() {
  let props;
  beforeEach(() => {
    props = { ux: new BuilderUX() };
  });

  it('it sets type when type is clicked', function() {
    const wrapper = mount(<SelectType {...props} />);
    expect(props.ux.course_type).toEqual('');
    wrapper.find('[data-brand="coach"]').simulate('click');
    expect(props.ux.course_type).toEqual('coach');
    wrapper.find('[data-brand="tutor"]').simulate('click');
    expect(props.ux.course_type).toEqual('tutor');
  });

  it('matches snapshot', function() {
    const component = SnapShot.create(<SelectType {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
