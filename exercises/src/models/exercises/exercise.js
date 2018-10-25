import { action } from 'mobx';
import { identifiedBy, session } from 'shared/model';
import SharedExercise from 'shared/model/exercise';

export default
@identifiedBy('exercises/exercise')
class Exercise extends SharedExercise {

  @session error;

  @action onError({ message }) {
    this.error = message;
  }
};
