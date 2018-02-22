import {
  BaseModel, field, identifiedBy,
} from 'shared/model';

@identifiedBy('offerings/term')
export default class Term extends BaseModel {

  @field term;
  @field year;

}
