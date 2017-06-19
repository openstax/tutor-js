import {
  BaseModel, identifiedBy, field, identifier,
} from '../base';

@identifiedBy('user/viewed-tour-stat')
export default class ViewedTourStat extends BaseModel {

  @identifier identifier;
  @field view_count = 1;

}
