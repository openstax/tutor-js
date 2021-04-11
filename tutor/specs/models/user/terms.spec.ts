import { UserTerms, Term } from '../../../src/models/user/terms';
import User from '../../../src/models/user';
import { hydrateModel } from 'modeled-mobx';

jest.mock('../../../src/models/user', () => ({
    available_terms: [],
}));

describe('User Terms Store', function() {
    let terms: UserTerms;

    beforeEach(() => {
        terms = hydrateModel(UserTerms, {}, User);
    });

    it('filters out non required terms', () => {
        terms.onLoaded([
            { id: 1, title: 'None', name: 'none', is_signed: false },
            { id: 2, title: 'Done', name: 'complete', is_signed: true },
            { id: 3, title: 'Privacy', name: 'privacy_policy', is_signed: false },
        ].map(t => hydrateModel(Term, t)));
        expect(terms.requiredAndUnsigned.map((t) => t.id)).toEqual([3]);
    });

    it('signs unsigned terms and removes them from list', () => {
        const term = hydrateModel(Term, { id: 1, is_signed: false, title: 'TEST', name: 'privacy_policy' })
        terms.user.available_terms.splice(0, terms.user.available_terms.length, term)
        terms.onSigned([1])
        expect(term.is_signed).toBe(true);
        expect(terms.requiredAndUnsigned).toHaveLength(0);
    });
});
