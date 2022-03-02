import { BaseModel, model, modelize, array, runInAction, hydrateModel } from 'shared/model'
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
        runInAction(() => {
            this.all.replace(
                books.sort((a, b) => a.title == b.title ? 0 : a.title < b.title ? -1 : 1).map(
                    (book:Book) => hydrateModel(Book, book, this)
                )
            )
        })
    }

    async ensureLoaded(): Promise<any> {
        if (this.all.length == 0) this.fetch()
    }

}

const books = new Books()

export default books
