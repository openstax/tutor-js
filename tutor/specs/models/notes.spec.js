import { Factory } from '../helpers';
import { Notes, Note } from '../../src/models/notes';

describe('Notes Model', () => {
  let notes;

  beforeEach(() => {
    notes = new Notes({ course: Factory.course() });
  });

  it('calls save and adds to sections', () => {
    const notesPage = Factory.notesPageMap({
      course: notes.course, chapter: 2, section: 1,
    });
    const spy = jest.spyOn(Note.prototype, 'save').mockImplementation(() => Promise.resolve());
    const page = Factory.page();
    return notesPage.create({
      page,
      anchor: '1234',
      contents: { foo: '123' },
    }).then(() => {
      expect(spy).toHaveBeenCalled();
      expect(
        notesPage.notes.sections[0].chapter_section.key
      ).toEqual(page.chapter_section.key);
    });
  });

});
