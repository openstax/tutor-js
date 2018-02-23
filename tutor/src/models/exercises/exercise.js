import { last, map, filter } from 'lodash';
import { computed } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, hasMany,
} from 'shared/model';
import Tag from './tag';

@identifiedBy('exercises/exercise')
export default class Exercise extends BaseModel {

  @identifier id;
  @field ecosystem_id;
  @field page_id;

  @field({ type: 'object' }) content;

  @field has_interactive;
  @field has_video;
  @field page_uuid;
  @field({ type: 'array' }) pool_types;
  @field url = '';
  @hasMany({ model: Tag }) tags;

  @computed get types() {
    return map(
      filter(this.tags, tag =>
        tag.id.startsWith('filter-type:') || tag.id.startsWith('type:')
      ),
      tag => last(tag.id.split(':'))
    );
  }

}
