import { Factory } from '../helpers';
import DATA from '../../api/notes.json';
import { keys } from 'lodash';
import Notes, { PageNotes, Note } from '../../src/models/notes';
import FeatureFlags from '../../src/models/feature_flags';
import Hypothesis from '../../src/models/notes/hypothesis';
jest.mock('../../src/models/feature_flags');
jest.mock('../../src/models/notes/hypothesis');

describe('Notes Model', () => {
  let notes;

  beforeEach(() => {
    FeatureFlags.is_highlighting_allowed = true;
    notes = new Notes({ course: Factory.course() });
  });

  it('does not request info when feature flag is off', () => {
    const fetch = jest.spyOn(PageNotes.prototype, 'fetch');
    FeatureFlags.is_highlighting_allowed = false;
    notes.forPageId(1);
    expect(fetch).not.toHaveBeenCalled();
    FeatureFlags.is_highlighting_allowed = true;
    notes.forPageId(2);
    expect(fetch).toHaveBeenCalled();
  });

  it('maps notes by section', () => {
    const page = notes.forPageId(1);
    page.set(1, Factory.note());
    page.set(2, Factory.note());
    page.set(3, Factory.note());
    expect(page.notesBySection).toMatchSnapshot();
  });

});
