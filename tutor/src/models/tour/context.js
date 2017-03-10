import {
  BaseModel, identifiedBy, field, computed,
} from '../base';
import { find, isEmpty, intersection, compact } from 'lodash';
import Courses from '../courses';
import User from '../user';
import Tour from '../tour';

@identifiedBy('tour/context')
export default class TourContext extends BaseModel {

  @field({ type: 'array' }) tourIds;
  @field courseId;

  @computed get tours() {
    if (!this.tourIds) { return []; }
    return compact(this.tourIds.map(id => Tour.forIdentifier(id)));
  }

  @computed get course() {
    return this.courseId ? Courses.get(this.courseId) : undefined;
  }

  @computed get tour() {
    return this.tourForAudienceTags(this.course.tourAudienceTags) ||
      this.tourForAudienceTags(User.tourAudienceTags);
  }

  shutdown() {

  }

  // will have to filter based on more complex logic such as "has watched" in the near future
  tourForAudienceTags(tags) {
    return find(this.tours, tour => !isEmpty(intersection(tags, tour.audience_tags)));
  }

}
