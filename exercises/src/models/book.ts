import { BaseModel, field, modelize, computed } from 'shared/model';
import urlFor from '../api'


export default
class Book extends BaseModel {
    @field contents: string

    constructor() {
        super()
        modelize(this)
    }

    @computed get query() {
        const qq = { uuid: this.uuid }
        if (this.version) qq.version = this.version
        return qq
    }

    async fetch(): Promise<any>{
        this.contents = await this.api.request<any>(urlFor('book', this.query))
    }

    async ensureLoaded(): Promise<any> {
        if (!this.contents) this.fetch()
    }
}
