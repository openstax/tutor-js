import DATA from '../../api/notes.json';
import { keys } from 'lodash';
import Notes from '../../src/models/notes';
import FeatureFlags from '../../src/models/feature_flags';
import Hypothesis from '../../src/models/notes/hypothesis';
jest.mock('../../src/models/feature_flags');
jest.mock('../../src/models/notes/hypothesis');

describe('Notes Model', () => {

  beforeEach(() => {
    FeatureFlags.is_highlighting_allowed = false;
  });

  it('does not request info when feature flag is off', () => {
    const notes = new Notes();
    expect(notes.api.isPending).toBe(false);
    expect(Hypothesis.fetchUserInfo).not.toHaveBeenCalled();
  });

  it('sets notes', () => {
    const notes = new Notes();
    notes.updateNotes(DATA.rows);
    expect(notes.byCourseAndPage).toHaveProperty('1');
    expect(keys(notes.byCourseAndPage['1'])).toEqual(['2.1']);
  });

});
