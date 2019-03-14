import Exercise from '../../../src/models/exercises/exercise';
import User from '../../../src/models/user';

jest.mock('../../../src/models/user');

describe('Exercises model', () => {

  it('calculates read-only status', () => {
    const ex = new Exercise({ authors: [ {
      user_id: 1,
      name: 'Bob',
    } ] });
    expect(ex.isNew).toBe(true);
    expect(ex.canEdit).toBe(true);
    ex.uuid = '1234'; // no longer new
    expect(ex.isNew).toBe(false);
    expect(ex.canEdit).toBe(false);
    expect(ex.readOnlyReason).toEqual('Author: Bob');
    User.id = 1;
    expect(ex.canEdit).toBe(true);
    ex.is_vocab = true;
    expect(ex.canEdit).toBe(true);
  });

  it('returns a string error message', () => {
    const ex = new Exercise();
    expect(ex.errorMessage).toEqual('');
    ex.error = {
      warning: 'maybe stop it?',
      error: 'please make it stop',
    };
    expect(ex.errorMessage).toEqual(
      'warning: maybe stop it?; error: please make it stop'
    );
    ex.error = 'BAD BUGS1';
    expect(ex.errorMessage).toEqual('BAD BUGS1');
  });
});
