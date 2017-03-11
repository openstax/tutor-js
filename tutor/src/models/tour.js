import {
  BaseModel, identifiedBy, identifier, hasMany, field, computed,
} from './base';
import { partial, includes, some, each, compact } from 'lodash';
import TourStep from './tour/step';
import TourData from './tour/data.json';

// Tour Terminology

// Tours
// a set of instructions for viewing a Training Wheel, has-many TourSteps and TourActions

// TourActions
// scripted bits of logic for tour transitions like “Open User Menu” or “Advance Teacher Calendar” that will mimic user action during a tour.  May be a specialized type of TourStep (TBD by implementor)

// TourStep
// each step in a tour, where steps are connected by a “next” button that leads from one step to the next.  Has a title and rich text body

// TourWrapper
// wrapper React element that has an id to match to a Tour and provides context for the TourAchors.

// TourAnchor
// visual elements that a TourStep points to, provides styles to the TourStep to position it.

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

  @hasMany({ model: TourStep, inverseOf: 'tour' }) steps;

}
