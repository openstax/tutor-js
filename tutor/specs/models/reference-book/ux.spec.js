import { whenAsync } from 'mobx-utils';
import UX from '../../../src/models/reference-book/ux';
import { FactoryBot } from '../../factories';

import Book from '../../../src/models/reference-book';
import Page from '../../../src/models/reference-book/page';

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
    jest.spyOn(Page.prototype, 'ensureLoaded');
  });

  afterEach(() => {
    Book.prototype.fetch.mockRestore();
    Page.prototype.ensureLoaded.mockRestore();
  });

  it('sets and fetches book and then page when ecosystem is set', () => {
    expect(ux.book).toBeUndefined();
    ux.ecosystemId = 123;
    return whenAsync(() => ux.page).then(() => {
      expect(Book.prototype.fetch).toHaveBeenCalled();
      expect(ux.book).not.toBeUndefined();
      expect(ux.page).not.toBeUndefined();
    });
  });

  it('ensures pages are loaded when updated', () => {
    ux.update({ ecosystemId: 42, chapterSection: '1.2' });
    return whenAsync(() => ux.page).then(() => {
      expect(ux.book.id).toEqual(42);
      expect(ux.page.chapter_section.asString).toEqual('1.2');
      expect(ux.page.ensureLoaded).toHaveBeenCalled();
    });
  });

  it('stops listening on unmount', () => {
    ux.unmount();
    ux.ecosystemId = 123;
    expect(Book.prototype.fetch).not.toHaveBeenCalled();
  });
});
