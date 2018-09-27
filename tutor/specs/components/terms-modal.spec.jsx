import { Wrapper, SnapShot } from './helpers/component-testing';

import TermsModal from '../../src/components/terms-modal';
import User from '../../src/models/user';
import Factory from '../factories';
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
    User.terms_signatures_needed = true;
    expect(modal.is('Modal')).toBe(false);
    modal.setProps({ course: Factory.course() });
    expect(modal.is('Modal')).toBe(true);
  });

  it('signs term when agreed', () => {
    const term = new Term({
      id: 1, is_signed: false, content: 'TERMS TESTING CONTENT', title: 'SIGN ME',
    });
    term.sign = jest.fn();
    User.terms.sign = jest.fn();
    User.terms_signatures_needed = true;
    User.unsignedTerms = [ term ];
    const course = Factory.course();
    const modal = shallow(<TermsModal course={course} />);
    modal.find('Button').simulate('click');
    expect(User.terms.sign).toHaveBeenCalled();
  });


});
