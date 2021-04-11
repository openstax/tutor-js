import { when } from 'mobx';
import UX from '../../../src/models/reference-book/ux';
import { ApiMock, deferred, FactoryBot } from '../../helpers';

//import Book from '../../../src/models/reference-book';
// import Node from '../../../src/models/reference-book/node';

describe(UX, () => {

    let ux!:UX;

    ApiMock.intercept({
        'ecosystems/\\d+/readings': [ FactoryBot.create('Book') ],
        'ecosystems/\\d+/pages/.*': FactoryBot.create('Page'),
    })


    beforeEach(() => {
        ux = new UX();// eslint-disable-next-line
        // jest.spyOn(Book.prototype, 'fetch').mockImplementation(function(this: Book) {
        //     this.update(
        //         FactoryBot.create('Book', { id: this.id, type: 'biology' }),
        //     );
        //     return Promise.resolve();
        // });
        // jest.spyOn(Node.prototype, 'ensureLoaded').mockImplementation(function() {
        //     return Promise.resolve();
        // });
    });

    afterEach(() => {
        // Book.prototype.fetch.mockRestore();
        // Node.prototype.ensureLoaded.mockRestore();
    });

    it('sets and fetches book and then page when ecosystem is set', async () => {
        expect(ux.book).toBeUndefined();
        ux.ecosystemId = 123;
        await when(() => ux.page).then(() => {
            expect(ux.book).not.toBeUndefined();
            expect(ux.page).not.toBeUndefined();
        });
    });

    it('ensures pages are loaded when updated', async () => {
        ux.update({ ecosystemId: 42, pageId: '12865' });
        await when(() => ux.page).then(() => {
            expect(ux.book?.id).toEqual(42);
        });
    });

    it('stops listening on unmount', () => {
        ux.unmount();
        ux.ecosystemId = 123;
        expect(ux.book).toBeUndefined()
    });

    it('hides menu and scrolls to top when toc section is selected', () => {
        expect(ux.isMenuOnTop).toBe(true);
        ux.isMenuVisible = true;
        ux.scroller.scrollToTop = jest.fn()
        ux.onMenuSelection('1.2');
        expect(ux.scroller.scrollToTop).toHaveBeenCalledWith({ deferred: true });
        expect(ux.isMenuVisible).toBe(false);
        ux.unmount();
    });

    it('redirects to page id', async () => {
        ux.history = { push: jest.fn() };
        ux.ecosystemId = 123;
        ux.courseId = 1
        await when(() => ux.page).then(() => {
            ux.update({ chapterSection: '8.2' });
        })
        await deferred(() => {
            expect(ux.history.push).toHaveBeenCalledWith('/book/1/page/12942')
        })
    });
});
