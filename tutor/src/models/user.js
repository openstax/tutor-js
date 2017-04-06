import {
  BaseModel, identifiedBy, field,
} from './base';
import { uniq, flatMap } from 'lodash';
import { action, computed } from 'mobx';
import { CurrentUserActions, CurrentUserStore } from '../flux/current-user';

import Courses from './courses';

@identifiedBy('user')
export class User extends BaseModel {

  @action.bound
  bootstrap(data) {
    CurrentUserActions.loaded(data);
    this.update(data);
    CurrentUserStore.on('change', () => this.update(CurrentUserStore.get()));
  }

  @field name;

  @field faculty_status;
  @field profile_url;

  @field is_admin;
  @field is_content_analyst;
  @field is_customer_service;

  @field({ type: 'array' }) viewed_tour_ids;

  @computed get tourAudienceTags() {
    return []; // we may have special per-user tags at some point?
  }

  replayTour(tour) {
    this.viewed_tour_ids.remove(tour.id);
  }

  viewedTour(tour, options) {
    this.viewed_tour_ids.push(tour.id);
    this.saveTourView(tour, options);

  }

  // this method will be wrapped by the API to trigger saving a tour view
  saveTourView(tour, options) {
    return { data: options };
  }

}

const currentUser = new User;

export default currentUser;
