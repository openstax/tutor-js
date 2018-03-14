import Map from 'shared/model/map';
import { computed, action, observable, toJS } from 'mobx';
import Exercise from './exercises/exercise';


export class ExercisesMap extends Map {

  NEW = 'new';

  findOrCreateNewRecord(){
    let ex = this.get(this.NEW);
    if (!ex) {
      ex = Exercise.build({ id: this.NEW });
      this.set(this.NEW, ex);
    }
    return ex;
  }

  ensureFetched(exId) {

  }
}


const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
