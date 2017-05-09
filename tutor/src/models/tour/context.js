import {
  BaseModel, identifiedBy, computed, observable, field,
} from '../base';
import {
  find, isEmpty, intersection, compact, uniq, flatMap, map, includes, filter,
} from 'lodash';
import { observe, action } from 'mobx';

import Courses   from '../courses-map';
import User      from '../user';
import Tour      from '../tour';
import TourRide  from './ride';
import invariant from 'invariant';

// TourContext
// Created by the upper-most React element (the Conductor)
// Regions and Anchors check in and out as they're mounted/unmounted

@identifiedBy('tour/context')
export default class TourContext extends BaseModel {

  @observable regions = observable.shallowArray();
  @observable anchors = observable.shallowMap();

  @field isEnabled = false;

  @field emitDebugInfo = false;

  @observable forcePastToursIndication;

  constructor(attrs) {
    super(attrs);
    observe(this, 'tourRide', this._onTourRideChange.bind(this));
  }

  @computed get tourIds() {
    if (this.isEnabled) {
      return compact(uniq(flatMap(this.regions, r => r.tour_ids)));
    } else {
      return [];
    }

    //return compact(uniq(flatMap(this.regions, r => r.tour_ids)));
  }

  @computed get courseIds() {
    return compact(uniq(map(this.regions, 'courseId')));
  }

  @computed get courses() {
    return compact(this.courseIds.map(id => Courses.get(id)));
  }

  addAnchor(id, domEl) {
    this.anchors.set(id, domEl);
  }

  removeAnchor(id) {
    this.anchors.delete(id);
  }

  openRegion(region) {
    const existing = find(this.regions, { id: region.id });
    if (existing){
      invariant(existing === region, `attempted to add region ${region.id}, but it already exists!`);
    } else { // no need to add if existing is the same object
      this.regions.push(region);
    }
  }

  closeRegion(region) {
    this.regions.remove(region);
  }

  @computed get activeRegion() {
    if (!this.tour){ return null; }
    return this.regions.find(region => region.tour_ids.find(tid => tid === this.tour.id));
  }

  // The tour that should be shown
  @computed get tour() {
    return find(this.elgibleTours, 'isViewable') || null;
  }

  @computed get tourRide() {
    const { tour } = this;
    if ( tour ) {
      return new TourRide({ tour, context: this, region: this.activeRegion });
    }
    return null;
  }

  @computed get audienceTags() {
    return uniq(flatMap(this.courses, c => c.tourAudienceTags));
  }

  @computed get toursTags() {
    return flatMap(this.allTours, t => t.audience_tags);
  }

  @computed get allTours() {
    return compact(this.tourIds.map(id => Tour.forIdentifier(id)));
  }

  @computed get elgibleTours() {
    return filter(this.allTours, (tour) => (!isEmpty(intersection(tour.audience_tags, this.audienceTags))));
  }

  // same logic as above but uses find, which short-circuits after a match
  @computed get hasElgibleTour() {
    return !!find(this.allTours, (tour) => (!isEmpty(intersection(tour.audience_tags, this.audienceTags))));
  }

  @computed get debugStatus() {
    return `available regions: [${map(this.regions, 'id')}]; region tour ids: [${this.tourIds}]; audience tags: [${this.audienceTags}]; tour tags: [${this.toursTags}]; elgible tours: [${map(this.elgibleTours,'id')}]; TOUR RIDE: ${this.tourRide ? this.tourRide.tour.id : '<none>'}`;
  }

  @action playTriggeredTours() {
    this.elgibleTours.forEach((tour) => {
      if (!tour.auto_display){ tour.play(); }
    });
  }

  _onTourRideChange({ type, oldValue: oldRide }) {
    if (type !== 'update') { return; }
    if (oldRide) { oldRide.dispose(); }
  }

}
