import {
  BaseModel, identifiedBy, identifier, hasMany, field,
} from './base';
import { partial, some, each, compact, map, filter } from 'lodash';
import includes from 'lodash/includes'; // babel-traverse blows up with includes is in list above?
import TourStep from './tour/step';
import { computed, action } from 'mobx';
// compiles and exports the data for tours from the JSON files
import TourData from '../tours';
import User from './user';

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

  @computed static get all() {
    return map(TourData, (_, id) => this.forIdentifier(id));
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

  @field group_id;
  @field name;
  @field({ type: 'array' }) audience_tags;
  @field scrollToSteps;
  @field showOverlay;

  @hasMany({ model: TourStep, inverseOf: 'tour' }) steps;


  @computed get othersInGroup() {
    if (!this.group_id){ return []; }
    return filter(Tour.all, { group_id: this.group_id });
  }

  @action
  replay() {
    User.replayTour(this);
    this.othersInGroup.forEach((tour) => User.replayTour(tour));
  }

  @action
  markViewed({ exitedEarly }){
    User.viewedTour(this, { exitedEarly });
    if (exitedEarly) {
      this.othersInGroup.forEach(tour => User.viewedTour(tour, { exitedEarly }));
    }
  }
}
