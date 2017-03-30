import {
  BaseModel, identifiedBy, identifier, hasMany, field,
} from './base';
import { partial, includes, some, each, compact } from 'lodash';
import TourStep from './tour/step';

// compiles and exports the data for tours from the JSON files
import TourData from '../tours';

// Tour
// A set of instructions for viewing a Training Wheel, has-many TourSteps and TourActions

const TourInstances = new Map();
function getTour(id) {
  let tour = TourInstances.get(id);
  if (!tour){
    tour = new Tour(TourData[id]);
    TourInstances.set(id, tour);
  }
  return tour;
}

@identifiedBy('tour')
export default class Tour extends BaseModel {

  static forIdentifier(id) {
    return TourData[id] ? getTour(id) : undefined;
  }

  static forAudienceTags(tags) {
    const tours = [];
    const doesIncludeTag = partial(includes, tags);
    each(TourData, (data, id) => {
      if (some(data.audience_tags, doesIncludeTag)) { tours.push(getTour(id)); }
    });
    return compact(tours);
  }

  @identifier id;

  @field name;
  @field({ type: 'array' }) audience_tags;
  @field scrollToSteps;
  @field showOverlay;

  @hasMany({ model: TourStep, inverseOf: 'tour' }) steps;

}
