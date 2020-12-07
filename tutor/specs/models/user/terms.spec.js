import { UserTerms, Term } from '../../../src/models/user/terms';
import User from '../../../src/models/user';

jest.mock('../../../src/models/user', () => ({
  available_terms: [],
}));

describe('User Terms Store', function() {
  let terms;

  beforeEach(() => {
    terms = new UserTerms({ user: User });
  });

  it('filters out non required terms', () => {
    terms.onLoaded({
      data: [
        { id: 1, name: 'none', is_signed: false },
        { id: 2, name: 'complete', is_signed: true },
        { id: 3, name: 'privacy_policy', is_signed: false, isRequired: true },
      ],
    });
    expect(terms.requiredAndUnsigned.map((t) => t.id)).toEqual([3]);
  });

  it('signs unsigned terms and removes them from list', () => {
    const term = new Term({ id: 1, is_signed: false, title: 'TEST', name: 'privacy_policy' })
    terms.user.available_terms = [ term ];
    terms.onSigned({}, [[1]]);
    expect(term.is_signed).toBe(true);
    expect(terms.requiredAndUnsigned).toHaveLength(0);
  });
});
