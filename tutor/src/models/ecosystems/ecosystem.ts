import { BaseModel, model, modelize, computed, NEW_ID } from 'shared/model';

import ReferenceBook from '../reference-book';
import Book from './book';
import lazyGetter from 'shared/helpers/lazy-getter';

export default class Ecosystem extends BaseModel {
    @field id = NEW_ID;
    @model(Book) books;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    // shortcut since we only have a single book per ecosystem currently
    @computed get book() {
        return this.books.length ? this.books[0] : null;
    }

    @lazyGetter referenceBook = new ReferenceBook({ id: this.id });
}
