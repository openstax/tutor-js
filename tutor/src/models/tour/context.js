import {
  BaseModel, identifiedBy, field, computed, observable,
} from '../base';
import { find, isEmpty, intersection, compact, uniq, flatMap, map } from 'lodash';
import Courses from '../courses';
import User from '../user';
import Tour from '../tour';

@identifiedBy('tour/context')
export default class TourContext extends BaseModel {

  @observable regions = observable.shallowMap();

  @computed get tourIds() {
    return uniq(flatMap(this.regions.values(), 'tourIds'));
  }

  @computed get courseIds() {
    return uniq(map(this.regions.values(), 'courseId'));
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

  updateRegion(regionId, { courseId, tourIds }) {
    this.regions.set(regionId, { courseId, tourIds });
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

  shutdown() {

  }

  // will have to filter based on more complex logic such as "has watched" in the near future
  tourForAudienceTags(tags) {
    return find(this.tours, tour => !isEmpty(intersection(tags, tour.audience_tags)));
  }

}
