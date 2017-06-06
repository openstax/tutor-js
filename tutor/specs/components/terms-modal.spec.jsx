import { Wrapper, SnapShot } from './helpers/component-testing';

import TermsModal from '../../src/components/terms-modal';
import User from '../../src/models/user';
import { Term } from '../../src/models/user/terms';

jest.mock('../../src/models/user', () => ({
  terms_signatures_needed: false,
  unsignedTerms: [],
}));

describe('Terms agreement modal', () => {

  it('does not render when there are no terms', () => {
    const modal = shallow(<TermsModal />);
    expect(modal.children()).toHaveLength(0);
  });

  it('renders and matches snapshot when there are terms', () => {
    User.unsignedTerms = [ new Term({
      id: 1, is_signed: false, title: 'SIGN ME',
      content: 'TERMS TESTING CONTENT <p> with some HTML</p>',
    }) ];
    expect(SnapShot.create(<TermsModal />).toJSON()).toMatchSnapshot();
  });

  it('signs term when agreed', () => {
    const term = new Term({
      id: 1, is_signed: false, content: 'TERMS TESTING CONTENT', title: 'SIGN ME',
    });
    term.sign = jest.fn();
    User.terms = { sign: jest.fn() };
    User.unsignedTerms = [ term ];
    const modal = shallow(<TermsModal />);
    modal.find('Button').simulate('click');
    expect(User.terms.sign).toHaveBeenCalled();
  });

});
