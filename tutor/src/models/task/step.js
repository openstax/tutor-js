import {
  BaseModel, identifiedBy, identifier, hasMany, field, belongsTo,
} from '../base';
import { computed } from 'mobx';
import { last } from 'lodash';

import RelatedContent from './step-related-content';

@identifiedBy('task/step')
export default class TaskStep extends BaseModel {

  @identifier id;
  @field task_id;
  @field title;
  @field type;

  @field({ type: 'array' }) chapter_section;
  @field content_html;
  @field content_url;
  @field({ type: 'date' }) first_completed_at;
  @field({ type: 'date' }) last_completed_at;

  @field group;
  @field has_recovery;

  @field is_completed;

  @field({ type: 'array' }) labels;

  @hasMany({ model: RelatedContent }) related_content;

  @belongsTo({ model: 'task' }) task;

  @computed get cnxId() {
    return last( (this.content_url || '').split('contents/') );
  }
}
