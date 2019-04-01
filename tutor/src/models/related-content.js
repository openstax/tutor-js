import { BaseModel, identifiedBy, belongsTo, field } from 'shared/model';
import ChapterSection from './chapter-section';

export default
@identifiedBy('related-content')
class RelatedContent extends BaseModel {

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
