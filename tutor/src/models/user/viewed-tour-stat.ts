import { BaseModel, field, NEW_ID } from 'shared/model';

export default class ViewedTourStat extends BaseModel {

  @field id = NEW_ID;
  @field view_count = 1;

}
