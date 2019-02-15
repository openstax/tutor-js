import { Factory } from '../helpers';
import DATA from '../../api/notes.json';
import { keys } from 'lodash';
import Notes, { PageNotes, Note } from '../../src/models/notes';

describe('Notes Model', () => {
  let notes;

  beforeEach(() => {
    notes = new Notes({ course: Factory.course() });
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
