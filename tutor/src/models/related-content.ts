import { BaseModel, model, field, NEW_ID } from 'shared/model';
import ChapterSection from './chapter-section';

export default class RelatedContent extends BaseModel {

    @field uuid = NEW_ID;
    @field page_id;
    @field title;
    @model(ChapterSection) chapter_section;

    constructor(attrs) {
        if (attrs.book_location) {
            attrs.chapter_section = attrs.book_location;
            delete attrs.book_location;
        }
        super(attrs);
    }
}
