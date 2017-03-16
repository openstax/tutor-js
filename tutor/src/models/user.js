import {
  BaseModel, identifiedBy, field,
} from './base';
import { uniq, flatMap } from 'lodash';
import { action, computed } from 'mobx';
import { CurrentUserActions } from '../flux/current-user';

import Courses from './courses';

@identifiedBy('user')
export class User extends BaseModel {

  @action.bound
  bootstrap(data) {
    CurrentUserActions.loaded(data);
    this.update(data);
  }

  @field name;

  @field faculty_status;
  @field profile_url;

  @field is_admin;
  @field is_content_analyst;
  @field is_customer_service;

  @field({ type: 'array' }) viewed_tour_ids;

  @computed get tourAudienceTags() {
    return uniq(flatMap(Courses.values(), 'tourAudienceTags'));
  }

  replayTours() {
    // once we start saving the viewed tours we'll need two arrays
    // on for the "real" viewed state and one of the "available to view"
    this.viewed_tour_ids.clear();
  }

  viewedTour(tour) {
    // FIXME: SAVE event call goes here, or more likely it'll autorun whenever "viewed_tour_ids" updates
    this.viewed_tour_ids.push(tour.id);
  }
}

const currentUser = new User;

export default currentUser;
