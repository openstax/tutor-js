import { action, computed } from 'mobx';
import { find } from 'lodash';
import { identifiedBy, session } from 'shared/model';
import SharedExercise from 'shared/model/exercise';
import CurrentUser from '../user';

export default
@identifiedBy('exercises/exercise')
class Exercise extends SharedExercise {

  @session error;

  @action onError({ message }) {
    this.error = message;
  }

  @computed get readOnlyReason() {
    if (!find(this.authors, { user_id: CurrentUser.id })) {
      return `Author: ${this.authors.names().join(',')}`;
    }
    if (this.is_vocab) {
      return 'Vocabulary';
    }
    return null;
  }

  @computed get canEdit() {
    return !this.readOnlyReason;
  }
};
