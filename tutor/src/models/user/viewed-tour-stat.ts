import { BaseModel, field, identifier } from 'shared/model';

export default class ViewedTourStat extends BaseModel {

  @identifier id;
  @field view_count = 1;

}
