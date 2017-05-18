import {
  BaseModel, field, identifier, hasMany, identifiedBy,
} from '../../base';
import { filter, includes, first } from 'lodash';
import { computed } from 'mobx';
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

  @computed get validTerms() {
    if (this.is_concept_coach){
      return filter(this.active_term_years, (t) => t.year == 2017 && includes(['spring', 'summer'], t.term));
    }
    return this.active_term_years;
  }

  @computed get currentTerm() {
    return first(this.validTerms);
  }
}
