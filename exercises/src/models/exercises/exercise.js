import { action, computed } from 'mobx';
import { find, isEmpty, isObject, map } from 'lodash';
import { identifiedBy, session } from 'shared/model';
import SharedExercise from 'shared/model/exercise';
import CurrentUser from '../user';

export default
@identifiedBy('exercises/exercise')
class Exercise extends SharedExercise {

  @session error;

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
    if (!find(this.authors, { user_id: CurrentUser.id })) {
      return `Author: ${this.authors.names().join(',')}`;
    }
    return null;
  }

  @computed get canEdit() {
    return !this.readOnlyReason;
  }
};
