import {
  BaseModel, field, identifiedBy,
} from 'shared/model';

export default
@identifiedBy('offerings/term')
class Term extends BaseModel {

  @field term;
  @field year;

  is(term, year) {
    return this.term == term && this.year === year;
  }
};
