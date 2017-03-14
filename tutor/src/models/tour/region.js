import {
  BaseModel, identifiedBy, field, identifier, computed,
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

  @computed get domSelector() {
    return `[data-tour-region-id="${this.id}"]`;
  }

  @field({ type: 'array' }) tour_ids;

}
