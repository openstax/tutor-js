import { BaseModel, model, modelize, array, computed, field, NEW_ID, lazyGetter, hydrateModel } from 'shared/model';
import { ReferenceBook, EcosystemBook } from '../../models'


export class Ecosystem extends BaseModel {
    @field id = NEW_ID;

    @model(EcosystemBook) books = array<EcosystemBook>()

    constructor() {
        super();
        modelize(this);
    }

    // shortcut since we only have a single book per ecosystem currently
    @computed get book() {
        return this.books.length ? this.books[0] : null;
    }

    @lazyGetter get referenceBook() { return hydrateModel(ReferenceBook, { id: this.id }, this) }
}
