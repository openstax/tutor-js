import User from '../../../src/models/user';
import ModalManager from '../../../src/components/modal-manager';
import NewCourse from '../../../src/screens/new-course';

jest.mock('../../../src/models/loader');
jest.mock('../../../src/models/user', () => ({
  terms_signatures_needed: false,
  isCollegeTeacher: true,
}));

describe('NewCourse wrapper', function() {

  it('requires terms', () => {
    User.terms_signatures_needed = true;
    const wrapper = shallow(<ModalManager><NewCourse /></ModalManager>).dive().dive().dive();
    expect(wrapper).toHaveRendered('TermsModal');
  });

});
