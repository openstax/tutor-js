import { BaseModel, ID, model, field, NEW_ID, modelize } from 'shared/model';
import { ChapterSection } from '../models'

export class RelatedContent extends BaseModel {

    @field uuid = ''
    @field page_id:ID = NEW_ID
    @field title = ''
    @model(ChapterSection) chapter_section = ChapterSection.blank;

    constructor() {
        super()
        modelize(this)
    }

    hydrate(attrs: any) {
        if (attrs.book_location) {
            attrs.chapter_section = attrs.book_location;
            delete attrs.book_location;
        }
        Object.assign(this, attrs)
    }

}
