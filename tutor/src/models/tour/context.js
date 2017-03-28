import {
  BaseModel, identifiedBy, computed, observable, field,
} from '../base';
import { find, isEmpty, intersection, compact, uniq, flatMap, map, includes } from 'lodash';
import { autorun, observe } from 'mobx';

import Courses   from '../courses';
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

  @observable forcePastToursIndication;

  constructor(attrs) {
    super(attrs);
    observe(this, 'tourRide', this._onTourRideChange.bind(this));
  }

  @computed get tourIds() {
    if (!this.isEnabled) { return []; }
    return compact(uniq(flatMap(this.regions, r => r.tour_ids.peek())));
  }

  @computed get courseIds() {
    return compact(uniq(map(this.regions, 'courseId')));
  }

  @computed get tours() {
    return compact(this.tourIds.map(id => Tour.forIdentifier(id)));
  }

  @computed get courses() {
    return compact(this.courseIds.map(id => Courses.get(id)));
  }

  @computed get courseAudienceTags() {
    return uniq(flatMap(this.courses, c => c.tourAudienceTags));
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
      invariant(existing === region, 'attempted to add a region when one already exist with same id');
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

  @computed get tour() {
    return this.tourForAudienceTags(this.courseAudienceTags) ||
      this.tourForAudienceTags(User.tourAudienceTags);
  }

  @computed get tourRide() {
    const { tour } = this;
    if ( tour ) {
      return new TourRide({ tour, context: this, region: this.activeRegion });
    }
    return null;
  }

  @computed get hasReplayableTours() {
    return !!(
      this.forcePastToursIndication ||
        !isEmpty(intersection(this.tourIds, User.viewed_tour_ids))
    );
  }

  @computed get toursTags() {
    return flatMap(this.tours, t => t.audience_tags);
  }

  tourForAudienceTags(tags) {
    return find(this.tours, tour => !(
      includes(User.viewed_tour_ids, tour.id) || isEmpty(intersection(tags, tour.audience_tags))
    )) || null;
  }

  @computed get debugStatus() {
    return `available regions: [${map(this.regions, 'id')}]; region tour ids: [${this.tourIds}]; valid tours: [${map(this.tours,'id')}]; viewed tours: [${User.viewed_tour_ids}]; tour tags: [${this.toursTags}]; User tags: [${User.tourAudienceTags}]; course tags: [${this.courseAudienceTags}]; TOUR RIDE: ${this.tourRide ? this.tourRide.tour.id : '<none>'}`;
  }

  _onTourRideChange({ type, oldValue: oldRide }) {
    if (type !== 'update') { return; }
    if (oldRide) { oldRide.dispose(); }
  }

}
