import {
  BaseModel, identifiedBy, field,
} from './base';
import { action } from 'mobx';
import { CurrentUserActions } from '../flux/current-user';


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
