import User from '../../../src/models/user';

jest.mock('../../../src/models/loader');
jest.mock('../../../src/models/user', () => ({
  terms_signatures_needed: false,
}));

import NewCourse from '../../../src/components/new-course';

describe('NewCourse wrapper', function() {

  it('loads offerings when created', function() {
    const wrapper = shallow(<NewCourse />);
    expect(wrapper.instance().loader.constructor)
      .toHaveBeenCalledWith(expect.objectContaining({ fetch: true }));
  });

  it('requires terms', () => {
    User.terms_signatures_needed = true;
    const wrapper = shallow(<NewCourse />);
    expect(wrapper).toHaveRendered('TermsModal');
  });


});
