import {
  BaseModel, identifiedBy, field, identifier,
} from 'shared/model';

export default
@identifiedBy('user/viewed-tour-stat')
class ViewedTourStat extends BaseModel {

  @identifier id;
  @field view_count = 1;

}
