import { Factory } from '../helpers';
import TermsModal from '../../src/components/terms-modal';
import User from '../../src/models/user';
import { Term } from '../../src/models/user/terms';

jest.mock('../../src/models/user', () => ({
  terms_signatures_needed: false,
  unsignedTerms: [],
  terms: {
    api: { isPending: false },
  },
}));

describe('Terms agreement modal', () => {

  it('only renders when there are terms and course', () => {
    const modal = shallow(<TermsModal />);
    expect(modal.is('Modal')).toBe(false);
    expect(modal.text()).toBe('');
    User.terms_signatures_needed = true;
    modal.setProps({ canBeDisplayed: true });
    expect(modal.text()).toContain('I agree');
  });

  it('signs term when agreed', () => {
    const term = new Term({
      id: 1, is_signed: false, content: 'TERMS TESTING CONTENT', title: 'SIGN ME',
    });
    term.sign = jest.fn();
    User.terms.sign = jest.fn();
    User.terms_signatures_needed = true;
    User.unsignedTerms = [ term ];
    const modal = mount(<TermsModal canBeDisplayed />);
    modal.find('Button').simulate('click');
    expect(User.terms.sign).toHaveBeenCalled();
  });


});
