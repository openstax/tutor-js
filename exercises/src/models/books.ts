import Map from 'shared/model/map'
import { BaseModel, model, modelize, array, hydrateModel, hydrateInstance } from 'shared/model'
import Book from './book'
import urlFor from '../api'

export class Books extends BaseModel {

    @model(Book) all = array<Book>()

    constructor() {
        super()
        modelize(this)
    }

    async fetch(): Promise<any> {
        const books = await this.api.request<Book[]>(urlFor('books'))
        this.all.replace(books.map((book:Book) => hydrateModel(Book, book, this)))
    }

    async ensureLoaded(): Promise<any> {
        if (this.all.length == 0) this.fetch()
    }

}

const books = new Books()

export default books
