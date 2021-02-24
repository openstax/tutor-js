import { when } from 'mobx';
import UX from '../../../src/models/reference-book/ux';
import { FactoryBot, deferred } from '../../helpers';

import Book from '../../../src/models/reference-book';
import Node from '../../../src/models/reference-book/node';

describe(UX, () => {

    let ux;

    beforeEach(() => {
        ux = new UX();
        jest.spyOn(Book.prototype, 'fetch').mockImplementation(function() {
            this.onApiRequestComplete({
                data: [FactoryBot.create('Book', { id: this.id, type: 'biology' })],
            });
            return Promise.resolve();
        });
        jest.spyOn(Node.prototype, 'ensureLoaded').mockImplementation(function() {
            return Promise.resolve();
        });
    });

    afterEach(() => {
        Book.prototype.fetch.mockRestore();
        Node.prototype.ensureLoaded.mockRestore();
    });

    it('sets and fetches book and then page when ecosystem is set', () => {
        expect(ux.book).toBeUndefined();
        ux.ecosystemId = 123;
        return when(() => ux.page).then(() => {
            expect(Book.prototype.fetch).toHaveBeenCalled();
            expect(ux.book).not.toBeUndefined();
            expect(ux.page).not.toBeUndefined();
        });
    });

    it('ensures pages are loaded when updated', () => {
        ux.update({ ecosystemId: 42, pageId: '11883' });
        return when(() => ux.page).then(() => {
            expect(ux.book.id).toEqual(42);
            expect(ux.page.ensureLoaded).toHaveBeenCalled();
        });
    });

    it('stops listening on unmount', () => {
        ux.unmount();
        ux.ecosystemId = 123;
        expect(Book.prototype.fetch).not.toHaveBeenCalled();
    });

    it('hides menu and scrolls to top when toc section is selected', () => {
        expect(ux.isMenuOnTop).toBe(true);
        ux.isMenuVisible = true;
        ux.scroller = { scrollToTop: jest.fn() };
        ux.onMenuSelection('1.2');
        expect(ux.scroller.scrollToTop).toHaveBeenCalledWith({ deferred: true });
        expect(ux.isMenuVisible).toBe(false);
        ux.unmount();
    });

    it('redirects to page id', () => {
        ux.history = { push: jest.fn() };
        ux.courseId = 81;
        ux.book = { pages: { byChapterSection: {
            get: jest.fn(() => ({ id: 1234 })),
        } } };
        ux.update({ chapterSection: '8.23' });
        expect(ux.book.pages.byChapterSection.get).toHaveBeenCalledWith('8.23');
        return deferred(() => {
            expect(ux.history.push).toHaveBeenCalledWith('/book/81/page/1234');
        });
    });
});
