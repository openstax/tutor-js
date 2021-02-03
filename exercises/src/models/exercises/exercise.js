import { action, computed } from 'mobx';
import { find, isEmpty, isObject, map } from 'lodash';
import { hasMany, identifiedBy, session } from 'shared/model';
import Image from './image';
import Delegation from './delegation';
import SharedExercise from 'shared/model/exercise';
import CurrentUser from '../user';


@identifiedBy('exercises/exercise')
export default
class Exercise extends SharedExercise {

  @session error;
  @hasMany({ model: Image }) images;
  @hasMany({ model: Delegation }) delegations;

  @action onError(message) {
    this.error = message;
  }

  @computed get errorMessage() {
    if (isEmpty(this.error)) { return ''; }
    if (isObject(this.error)) {
      return map(this.error, (v, k) => `${k}: ${v}`).join('; ');
    }
    return this.error; // hope react can render whatever it is
  }

  @computed get readOnlyReason() {
    if (this.isNew) { return null; } // new records can always be edited
    const userId = CurrentUser.id;
    if (!find(this.authors.concat(this.copyright_holders), { user_id: userId }) &&
        !find(this.delegations, { delegate_id: userId, delegate_type: 'User', can_update: true })) {
      return `Author: ${this.authors.names().join(',')}`;
    }
    return null;
  }

  @computed get canEdit() {
    return !this.readOnlyReason;
  }
}
