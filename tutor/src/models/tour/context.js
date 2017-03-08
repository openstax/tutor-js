import {
  BaseModel, identifiedBy, identifier, belongsTo, field,
} from '../base';

@identifiedBy('tour/context')
export default class TourContext extends BaseModel {


  @field({ type: 'object' }) wrapper;


  shutdown() {

  }

}
