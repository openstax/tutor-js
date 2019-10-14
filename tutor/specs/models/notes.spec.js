import { Factory } from '../helpers';
import { Notes, Note } from '../../src/models/notes';

describe('Notes Model', () => {
  let notes;

  beforeEach(() => {
    notes = new Notes({ course: Factory.course() });
  });

  it('calls save and adds to sections', () => {
    const page = Factory.page();
    const notesPage = Factory.notesPageMap({
      course: notes.course, page,
    });
    const spy = jest.spyOn(Note.prototype, 'save').mockImplementation(() => Promise.resolve());

    return notesPage.create({
      page,
      anchor: '1234',
      contents: { foo: '123' },
    }).then(() => {
      expect(spy).toHaveBeenCalled();
      expect(notesPage.notes.summary).toHaveLength(1);
      expect(notesPage.notes.summary[0]).toMatchObject({
        uuid: page.uuid,
        title: page.title,
      });
    });
  });

});
