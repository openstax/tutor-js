import { BaseModel, identifiedBy, observable, belongsTo, field } from 'shared/model';
import ChapterSection from './chapter-section';
import { computed } from 'mobx';

export default
@identifiedBy('related-content')
class RelatedContent extends BaseModel {

  @field title;
  @belongsTo({ model: ChapterSection }) chapter_section;

}
