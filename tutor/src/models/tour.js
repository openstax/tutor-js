import {
  BaseModel, identifiedBy, identifier, hasMany, field,
} from 'shared/model';
import { partial, some, each, compact, map, filter, max, defaults } from 'lodash';
import includes from 'lodash/includes'; // babel-traverse blows up with includes is in list above?
import TourStep from './tour/step';
import { computed, action } from 'mobx';
// compiles and exports the data for tours from the JSON files
import TourData from '../tours';
import User from './user';

// Tour
// A set of instructions for viewing a Training Wheel, has-many TourSteps and TourActions

const TourInstances = new Map();

export default
@identifiedBy('tour')
class Tour extends BaseModel {

  static forIdentifier(id, options) {
    const tourSettings = TourData[id];
    if (!tourSettings) {
      return undefined;
    }

    const { courseId } = options;
    let tourData;

    if (courseId) {
      if (tourSettings.perCourse) {
        tourId = `${id}-${courseId}`;
      }
      tourData = defaults({ courseId }, tourSettings);
    }
    else {
      if (tourSettings.perCourse) {
        return undefined;
      }
      tourData = tourSettings;
    }

    let tourId = id;
    let tour = TourInstances.get(tourId);
    if (!tour){
      tour = new Tour(tourData);
      TourInstances.set(tourId, tour);
    }
    return tour;
  }

  @computed static get all() {
    return map(TourData, (_, id) => this.forIdentifier(id, { courseId: this.courseId }));
  }

  @identifier id;

  @field group_id;
  @field name;
  @field({ type: 'array' }) audience_tags;
  @field scrollToSteps;
  @field showOverlay;
  @field autoplay = false;
  @field standalone = false;
  @field perCourse = false;
  @field sticky = false;
  @field isEnabled = false;
  @field justViewed = false;
  @field className;
  @field courseId;

  @hasMany({ model: TourStep, inverseOf: 'tour' }) steps;

  @computed get countId() {
    if (this.perCourse && this.courseId) {
      return `${this.id}-${this.courseId}`;
    }

    return this.id;
  }

  @computed get isViewable() {
    if (this.sticky) {
      return true;
    }
    if (this.autoplay) {
      const unViewed = !this.isViewed;
      if (this.standalone){
        return unViewed;
      }
      return unViewed || this.isEnabled;
    }
    return this.isEnabled;
  }

  @computed get isViewed() {
    return this.justViewed || this.viewCounts >= this.maxRequiredViewCounts;
  }

  @computed get othersInGroup() {
    if (!this.group_id){ return []; }
    return filter(Tour.all, { group_id: this.group_id });
  }

  @computed get viewCounts() {
    const stat = User.viewed_tour_stats.find((stat) => stat.id === this.countId);
    return stat? stat.view_count : 0;
  }

  @computed get maxRequiredViewCounts() {
    return max(map(this.steps, 'requiredViewsCount'));
  }

  @action
  play() {
    this.isEnabled = true;
    this.othersInGroup.forEach((tour) => tour.isEnabled = true);
  }

  @action
  markViewed({ exitedEarly }){
    this.justViewed = true;
    this.isEnabled = false;
    User.viewedTour(this, { exitedEarly });
    if (exitedEarly) {
      this.othersInGroup.forEach(tour => tour.isEnabled = false);
    }
  }
};
