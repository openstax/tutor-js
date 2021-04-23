import ModalManager from '../../src/components/modal-manager';
import TermsModal from '../../src/components/terms-modal';
import { hydrateModel } from 'shared/model'
import { ApiMock } from '../helpers'
import { currentUser, UserTerm as Term, UserTermsMap } from '../../src/models';

jest.mock('../../src/models/user', () => ({
    currentUser: {
        available_terms: [],
    },
}));

describe('Terms agreement modal', () => {

    let modalManager;
    let terms;
    ApiMock.intercept({
        'terms': [],
    })

    beforeEach(() => {
        terms = hydrateModel(UserTermsMap, {}, currentUser);
        currentUser.terms = terms
        modalManager = new ModalManager();
        modalManager.canDisplay = () => true;
    });

    describe('when there are no courses and no terms', () => {
        it('does not render', () => {
            const modal = shallow(<TermsModal modalManager={modalManager} />).dive();
            expect(modal.is('Modal')).toBe(false);
            expect(modal.text()).toBe('');
        });
    });

    describe('when there are courses and', () => {
        beforeEach(() => {
            currentUser.terms_signatures_needed = true;
        });

        describe('only signed terms', () => {
            beforeEach(() => {
                currentUser.terms.available_terms = [
                    {
                        id: 42,
                        name: 'general_terms_of_use',
                        title: 'Terms of Use',
                        content: 'bunch of HTML',
                        version: 2,
                        is_signed: true,
                        has_signed_before: true,
                        is_proxy_signed: true,
                    },
                ];
            });

            it('does not render', () => {
                const modal = shallow(<TermsModal canBeDisplayed modalManager={modalManager} />).dive();
                expect(modal.text()).toBe('');
            });
        });

        describe('some unsigned terms', () => {
            beforeEach(() => {
                terms.user.available_terms = [
                    hydrateModel(Term, {
                        id: 42,
                        name: 'general_terms_of_use',
                        title: 'Terms of Use',
                        content: 'bunch of HTML',
                        version: 2,
                        is_signed: false,
                        has_signed_before: true,
                        is_proxy_signed: false,
                    }, terms),
                ];
            });

            it('renders', () => {
                const modal = shallow(<TermsModal canBeDisplayed modalManager={modalManager} />).dive();
                expect(terms.user.available_terms[0].isRequired).toBe(true)
                expect(modal.text()).toContain('I agree');
            });
        });
    });

    it('signs term when agreed', () => {
        const term = hydrateModel(Term, {
            id: 1, is_signed: false, name: 'privacy_policy', content: 'TERMS TESTING CONTENT', title: 'SIGN ME',
        }, terms);
        term.sign = jest.fn();
        expect(term.isRequired).toBe(true)
        terms.user.available_terms = [term];
        terms.sign = jest.fn();

        const modal = mount(<TermsModal canBeDisplayed modalManager={modalManager} />);

        modal.find('Button').simulate('click');
        expect(terms.sign).toHaveBeenCalled();
    });
});
