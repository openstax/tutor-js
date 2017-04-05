import {
  BaseModel, identifiedBy, identifier, hasMany, field, belongsTo,
} from '../base';

@identifiedBy('task/step-related-content')
export default class RelatedContent extends BaseModel {

  @field title;
  @field({ type: 'array' }) chapter_section;

}
