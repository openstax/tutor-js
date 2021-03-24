import Exercise from '../../../src/models/exercises/exercise';
import User from '../../../src/models/user';
import { hydrate, NEW_ID } from 'shared/model';

jest.mock('../../../src/models/user');

describe('Exercises model', () => {

    it('calculates read-only status', () => {
        const ex = hydrate(Exercise, {
            tags: [ 'assignment-type:reading', 'requires-context:true' ],
            authors: [ { user_id: 1, name: 'Auron' } ],
            copyright_holders: [ { user_id: 2, name: 'Cory' } ],
            delegations: [
                { delegator_id: 1, delegate_id: 3, delegate_type: 'User', can_update: true },
                { delegator_id: 2, delegate_id: 4, delegate_type: 'User', can_update: true },
                { delegator_id: 1, delegate_id: 5, delegate_type: 'User', can_update: false },
                { delegator_id: 2, delegate_id: 6, delegate_type: 'Unknown', can_update: true },
            ],
        });

        expect(ex.id).toBe(NEW_ID)
        expect(ex.isNew).toBe(true);
        expect(ex.canEdit).toBe(true);
        expect(ex.tags.withType('assignment-type').value).toEqual('reading')

        ex.uid = '1234@1' // no longer new
        expect(ex.isNew).toBe(false);
        expect(ex.canEdit).toBe(false);
        expect(ex.readOnlyReason).toEqual('Author: Auron');

        User.id = 1;
        expect(ex.canEdit).toBe(true);

        ex.is_vocab = true;
        expect(ex.canEdit).toBe(true);

        User.id = 2;
        expect(ex.canEdit).toBe(true);

        ex.is_vocab = false;
        expect(ex.canEdit).toBe(true);

        User.id = 3;
        expect(ex.canEdit).toBe(true);

        User.id = 4;
        expect(ex.canEdit).toBe(true);

        User.id = 5;


        expect(ex.canEdit).toBe(false);

        User.id = 6;
        expect(ex.canEdit).toBe(false);
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
