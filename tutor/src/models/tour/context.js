import {
  BaseModel, identifiedBy, field, computed, observable,
} from '../base';
import { find, isEmpty, intersection, compact, uniq, flatMap, map } from 'lodash';
import Courses from '../courses';
import User from '../user';
import Tour from '../tour';
import invariant from 'invariant';
import Regions from './regions.json';

@identifiedBy('tour/context')
export default class TourContext extends BaseModel {

  @observable regions = observable.shallowArray();

  @computed get tourIds() {
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

  openRegion(region) {
    const existing = find(this.regions, {id: region.id});
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

  @computed get joyrideProps() {
    const { tour } = this;
    if (!tour) { return {}; }
    const props = {
      tourId: tour.id,
      steps: [], //tour.steps.map(ts => ({ }))
    };
    return props;
  }

  // will have to filter based on more complex logic such as "has watched" in the near future
  tourForAudienceTags(tags) {
    return find(this.tours, tour => !isEmpty(intersection(tags, tour.audience_tags)));
  }

}
