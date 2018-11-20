import { UserTerms } from '../../../src/models/user/terms';
import User from '../../../src/models/user';

jest.mock('../../../src/models/user', () => ({
  terms_signatures_needed: true,
}));

describe('User Terms Store', function() {
  let terms;

  beforeEach(() => {
    terms = new UserTerms({ user: User });
  });

  it('filters out signed terms', () => {
    terms.onLoaded({
      data: [
        { id: 1, is_signed: false },
        { id: 2, is_signed: true },
        { id: 3, is_signed: false },
      ],
    });
    expect(terms.unsigned.map((t) => t.id)).toEqual([1, 3]);
  });

  it('signs unsigned terms and removes them from list', () => {
    terms.onLoaded({
      data: [
        { id: 1, is_signed: false, title: 'TEST' },
      ],
    });
    const term = terms.unsigned[0];
    terms.onSigned();
    expect(term.is_signed).toBe(true);
    expect(terms.unsigned).toHaveLength(0);
  });
});
