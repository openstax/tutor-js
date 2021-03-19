import { identifier, BaseModel, identifiedBy, belongsTo, field } from 'shared/model';
import ChapterSection from './chapter-section';

@identifiedBy('related-content')
export default class RelatedContent extends BaseModel {

  @identifier uuid;
  @field page_id;
  @field title;
  @belongsTo({ model: ChapterSection }) chapter_section;

  constructor(attrs) {
      if (attrs.book_location) {
          attrs.chapter_section = attrs.book_location;
          delete attrs.book_location;
      }
      super(attrs);
  }
}
