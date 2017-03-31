import {
  BaseModel, identifiedBy, field, identifier, computed,
} from '../base';
import { extend } from 'lodash';
import invariant from 'invariant';

// TourRegion
// Wraps an area of the screen, maps it's id to a given set of audience tags

@identifiedBy('tour/region')
export default class TourRegion extends BaseModel {

  @identifier id;
  @field courseId;

  @field({ type: 'array' }) otherTours;

  @computed get tour_ids() {
    return [ this.id ].concat( this.otherTours );
  }

  @computed get domSelector() {
    return `[data-tour-region-id="${this.id}"]`;
  }

}
