import { Factory, ApiMock } from '../helpers';
import { Notes } from '../../src/models'

describe('Notes Model', () => {
    let course: ReturnType<typeof Factory.course>
    let notes: Notes;

    const mocks = ApiMock.intercept({
        'highlighted_sections$': { pages: [] },
        'notes$': (req) => {
            const note = { uuid: '233', annotation: 'hello world' }
            return Promise.resolve( req.method == 'GET' ? [note] : note)
        },
    })

    beforeEach(() => {
        course = Factory.course()
        notes = course.notes
    });

    it('calls save and adds to sections', async () => {
        expect(notes.course).toBeTruthy()
        const page = Factory.page();

        notes.fetchHighlightedPages()
        expect(mocks['highlighted_sections$']).toHaveBeenCalled()

        const notesPage = Factory.notesPageMap({ course: notes.course, page })

        await notesPage.create({
            page,
            anchor: '1234',
            contents: { foo: '123' },
        })
        expect(notesPage.notes.summary).toHaveLength(1)
    });

});
