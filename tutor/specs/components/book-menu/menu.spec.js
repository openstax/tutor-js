import { Factory, R, ld, deferred, runInAction } from '../../helpers';
import BookUX from '../../../src/components/book-menu/ux';
import Menu from '../../../src/components/book-menu/menu';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe('Book Menu', () => {

    let props;

    beforeEach(() => {
        const book = Factory.book();
        const pageId = book.pages.byId.keys()[0];
        const currentPage = book.pages.byId.get(pageId);
        const ux = new BookUX({ book, currentPage, wrapper: new FakeWindow });
        props = {
            ux,
            book,
            currentPage,
            pageLinkProps: (node) => ({
                tabIndex: 12, // normally ux.isMenuVisible ? 0 : -1
                className: 'node', // {node === ux.page ? 'active' : ''}
                to: 'viewReferenceBookPage',
                params: { pageId: 1234, courseId: 1 },
                onClick: jest.fn((ev) => {
                    ev.preventDefault();
                    return node;
                }), // ={partial(ux.onMenuSelection, node.chapter_section.asString)}
            }),
        };
    });

    it('retains open status when clicked', () => {
        const m = mount(<R><Menu {...props} /></R>);
        const lastChapter = ld.last(props.book.chapters);
        props.ux.expand(lastChapter);

        expect(m).toHaveRendered(`details[data-node-id="${lastChapter.pathId}"][open=true]`);

        // select a page on it
        runInAction(() => props.ux.currentPage = lastChapter.children[0]);
        // still selected
        expect(m).toHaveRendered(`details[data-node-id="${lastChapter.pathId}"][open=true]`);

        // now jump to the first page
        runInAction(() => props.ux.currentPage = props.book.pages.all[0]);

        // should still be selected since it was manually set
        expect(m).toHaveRendered(`details[data-node-id="${lastChapter.pathId}"][open=true]`);

        // work around a jsdom bug with details elements
        return deferred(() => {
            m.unmount();
        });

    });

    it('renders current page open', () => {
        const page = props.currentPage;
        const m = mount(<R><Menu {...props} /></R>);
        expect(m).toHaveRendered(`[data-node-id="${page.parent.pathId}"][open=true]`);
        const lastPage = ld.last(page.book.pages.all);
        runInAction(() => props.ux.currentPage = lastPage);
        expect(m).toHaveRendered(`[data-node-id="${page.parent.pathId}"][open=false]`);
        return deferred(() => {
            m.unmount();
        });
    });
});
