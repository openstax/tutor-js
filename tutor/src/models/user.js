import {
  BaseModel, identifiedBy,
} from './base';
import { CurrentUserActions } from '../flux/current-user';

@identifiedBy('user')
export default class User extends BaseModel {

  static bootstrap(data) {
    CurrentUserActions.loaded(data);
  }


}
