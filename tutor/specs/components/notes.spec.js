import NotesWidget from '../../src/components/notes';
import { Factory, FactoryBot, deferred } from '../helpers';
import Router from '../../src/helpers/router';
import loglevel from 'loglevel';

jest.mock('loglevel');
jest.mock('../../src/models/user', () => ({
    notesUX: {
        statusMessage: {
            show: jest.fn(),
            hide: jest.fn(),
            display: false,
        },
        hideSummary: jest.fn(),
        isSummaryVisible: true,
    },
}));
jest.mock('../../src/helpers/router');
jest.mock('../../../shared/src/components/html', () => ({ html }) =>
    html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Notes', () => {

    let props;

    beforeEach(function() {
        const course = Factory.course();

        course.referenceBook.update(FactoryBot.create('Book'));
        const page = course.referenceBook.pages.all[0]; //byChapterSection.get('1.1');

        Router.currentQuery.mockReturnValue({});
        const body = window.document.body;
        const notes = Factory.notesPageMap({ course, page });
        body.innerHTML = '<div id="mount"><div class="book-content">' +
      page.contents;
        window.MutationObserver = class {
      disconnect = jest.fn()
      observe = jest.fn()
        };
        window.getSelection = jest.fn(() => ({
            removeAllRanges: jest.fn(),
            addRange: jest.fn(),
            getRangeAt: jest.fn(() => ({
                cloneRange: jest.fn(),
                getBoundingClientRect: jest.fn(() => ({
                    bottom: 150,
                    top: 100,
                    left: 100,
                    right: 150,
                })),
            })),
        }));
        props = {
            page,
            notes,
            course,
            windowImpl: window,
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(
            <NotesWidget {...props}><p>hello</p></NotesWidget>,
            {
                createNodeMock: e => {
                    const parent = document.createElement('div');
                    const child = document.createElement(e.type);
                    parent.appendChild(child);
                    return child;
                },
            },
        ).toMatchSnapshot();
    });

    it('scrolls to pending highlights', () => {
        const noteId = props.notes.array[0].id;
        Router.currentQuery.mockReturnValue({ highlight: noteId });
        const notes = mount(<NotesWidget {...props}><p>hello</p></NotesWidget>);
        return deferred(() => {
            notes.unmount();
            expect(loglevel.error).toHaveBeenCalledWith(
                expect.stringContaining(`attempted to scroll to note id '${noteId}'`)
            );
        }, 150);
    });
});
