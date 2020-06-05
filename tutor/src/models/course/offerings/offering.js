import {
  BaseModel, field, identifier, hasMany, identifiedBy,
} from 'shared/model';
import { filter, includes, first } from 'lodash';
import { readonly } from 'core-decorators';
import { computed } from 'mobx';
import Term from './term';

export default
@identifiedBy('offerings/offering')
class Offering extends BaseModel {

  @readonly static possibleTerms = [
    'spring', 'summer', 'fall', 'winter',
  ];

  @identifier id;
  @field title;
  @field description;
  @field is_concept_coach;
  @field is_tutor;
  @field is_preview_available = true;
  @field is_available = true;
  @field preview_message;
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
