import { BaseModel, field, modelize, computed, runInAction } from 'shared/model';
import urlFor from '../api'

export interface BookPart {
    id: string
    slug: string
    title: string
    contents?: BookPart[]
}

interface Query {
    uuid: string
    version?: string
}
export default
class Book extends BaseModel {
    @field contents?: BookPart[]
    @field uuid = ''
    @field version = ''
    @field slug = ''
    @field title = ''

    constructor() {
        super()
        modelize(this)
    }

    @computed get query() {
        const qq:Query = { uuid: this.uuid }
        if (this.version) qq.version = this.version
        return qq
    }

    async fetch(): Promise<any>{
        const contents = await this.api.request<any>(urlFor('book', this.query))
        runInAction(() => this.contents = contents)
    }

    async ensureLoaded(): Promise<any> {
        if (!this.contents) this.fetch()
    }
}
