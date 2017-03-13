import {
  BaseModel, identifiedBy, field, identifier,
} from '../base';
import { extend } from 'lodash';


import RegionData from './regions.json';


@identifiedBy('tour/region')
export default class TourRegion extends BaseModel {

  static forIdentifier(id) {
    return RegionData[id] ? new TourRegion(
      extend({ id: id }, RegionData[id])
    ) : undefined;
  }

  @identifier id;
  @field courseId;

  @field({ type: 'array' }) tour_ids;

}
