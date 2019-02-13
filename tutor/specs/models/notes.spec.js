import { Factory } from '../helpers';
import DATA from '../../api/notes.json';
import { keys } from 'lodash';
import Notes, { PageNotes, Note } from '../../src/models/notes';
import FeatureFlags from '../../src/models/feature_flags';
jest.mock('../../src/models/feature_flags');

describe('Notes Model', () => {
  let notes;

  beforeEach(() => {
    FeatureFlags.is_highlighting_allowed = true;
    notes = new Notes({ course: Factory.course() });
  });

  it('does not request info when feature flag is off', () => {
    const fetch = jest.spyOn(PageNotes.prototype, 'fetch');
    FeatureFlags.is_highlighting_allowed = false;
    notes.forChapterSection(1, 1);
    expect(fetch).not.toHaveBeenCalled();
    FeatureFlags.is_highlighting_allowed = true;
    notes.forChapterSection(1, 2);
    expect(fetch).toHaveBeenCalled();
  });

  //   it('maps notes by section', () => {
  //     const page = Factory.notesPageMap({
  //       course: notes.course, chapter: 2, section: 1,
  //     });
  //     // Factory.notesPageMap({
  //     //   course: notes.course, chapter: 1, section: 1,
  //     // });
  //     expect(keys(page.notesBySection)).toEqual(['1.1', '2.1']);
  //   });
  //
  it('sorts in model', () => {
    // expect(Object.keys(notes.byCourseAndPage)).toEqual(['1']);
    // expect(Object.keys(notes.byCourseAndPage[1])).toEqual(['2.1']);
    // expect(Object.keys(notes.byCourseAndPage[1]['2.1'])).toHaveLength(2);
  });

});
