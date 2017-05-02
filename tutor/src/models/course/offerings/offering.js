import {
  BaseModel, field, identifier, hasMany, identifiedBy,
} from '../../base';

import Term from './term';

@identifiedBy('offerings/offering')
export default class Offering extends BaseModel {
  @identifier id;
  @field title;
  @field description;
  @field is_concept_coach;
  @field is_tutor;
  @field appearance_code;

  @hasMany({ model: Term }) active_term_years;
}
