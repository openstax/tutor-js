import {
  BaseModel, identifiedBy, field, identifier, computed,
} from '../base';
import { extend } from 'lodash';

// contains the mappings from region-ids to audiance tags
import RegionData from '../../tours/regions.json';

// TourRegion
// Wraps an area of the screen, maps it's id to a given set of audience tags

@identifiedBy('tour/region')
export default class TourRegion extends BaseModel {

  static forIdentifier(id, options = {}) {
    const data = RegionData[id] || RegionData[options.fallback];
    return data ? new TourRegion(extend({ id: id }, data[id])) : undefined;
  }

  @identifier id;
  @field courseId;

  @field({ type: 'array' }) tour_ids;

  @computed get domSelector() {
    return `[data-tour-region-id="${this.id}"]`;
  }

}
