import {
    BaseModel, identifiedBy, field, identifier,
} from 'shared/model';

@identifiedBy('user/viewed-tour-stat')
export default class ViewedTourStat extends BaseModel {

  @identifier id;
  @field view_count = 1;

}
