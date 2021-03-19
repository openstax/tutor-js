import {
    BaseModel, field, identifiedBy,
} from 'shared/model';

@identifiedBy('offerings/term')
export default class Term extends BaseModel {

  @field term;
  @field year;

  is(term, year) {
      return this.term == term && this.year === year;
  }

  isEqual(other) {
      return Boolean(other && this.is(other.term, other.year));
  }
}
