import {
  BaseModel, field, identifiedBy,
} from '../../base';

@identifiedBy('offerings/term')
export default class Term extends BaseModel {

  @field term;
  @field year;

}
