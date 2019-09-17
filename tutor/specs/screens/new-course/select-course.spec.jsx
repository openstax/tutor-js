import { React, Factory } from '../../helpers';
import SelectCourse from '../../../src/screens/new-course/select-course';
import BuilderUX from '../../../src/screens/new-course/ux';


jest.mock('../../../src/models/user', () => ({
  isCollegeTeacher: true,
}));

describe('CreateCourse: Selecting course subject', function() {

  let ux;
  beforeEach(() => {
    ux = new BuilderUX({
      router: { match: { params: {} } },
      offerings: Factory.offeringsMap({ count: 4 }),
    });
  });

  it('it sets offering_id when clicked', async function() {
    const wrapper = mount(<SelectCourse ux={ux} />);
    expect(await axe(wrapper.html())).toHaveNoViolations();
    expect(ux.newCourse.offering_id).toEqual('');
    wrapper.find('Choice').at(2).simulate('click');
    expect(ux.newCourse.offering_id).toEqual(ux.offerings.array[2].id);
  });

  it('matches snapshot', function() {
    expect.snapshot(<SelectCourse ux={ux} />).toMatchSnapshot();
  });

});
