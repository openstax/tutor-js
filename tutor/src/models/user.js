import {
  BaseModel, identifiedBy, field,
} from './base';
import { selected } from 'lodash';
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

}

const currentUser = new User;

export default currentUser;
