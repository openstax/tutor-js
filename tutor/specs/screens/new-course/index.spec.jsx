import User from '../../../src/models/user';

jest.mock('../../../src/models/loader');
jest.mock('../../../src/models/user', () => ({
  terms_signatures_needed: false,
  isCollegeTeacher: true,
}));

import NewCourse from '../../../src/screens/new-course';

describe('NewCourse wrapper', function() {

  it('requires terms', () => {
    User.terms_signatures_needed = true;
    const wrapper = shallow(<NewCourse />);
    expect(wrapper).toHaveRendered('TermsModal');
  });


});
