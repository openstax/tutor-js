import Map from 'shared/model/map';
import { sortBy, last } from 'lodash';
import { computed, action, observable, toJS } from 'mobx';
import Exercise from './exercises/exercise';

const NEW = 'new';

export class ExerciseVersions extends Map {

  get(version) {
    if (version === 'latest') {
      return last(sortBy(this.array, 'version'));
    } else {
      return super.get(version);
    }
  }

}

export class ExercisesMap extends Map {

  findOrCreateNewRecord() {
    let ex = this.get(NEW);
    if (!ex) {
      ex = Exercise.build({ id: NEW });
      this.set(NEW, ex);
    }
    return ex;
  }

  get(idWithVersion) {
    const [id, version = 'latest'] = String(idWithVersion).split('@');
    const versions = super.get(id);
    return versions ? versions.get(version) : null;
  }

  fetch(id) {
    if (!String(id).match(/@/)){ id = `${id}@latest`; }
    return { id };
  }

  @action onLoaded({ data }) {
    let versions = super.get(data.number);
    if (!versions) {
      versions = new ExerciseVersions();
      this.set(data.number, versions);
    }
    const ex = versions.get(data.version);
    ex ? ex.update(data) : versions.set(data.version, new Exercise(data));
  }

  @action ensureLoaded(numberWithVersion) {
    if (numberWithVersion === NEW) {
      this.findOrCreateNewRecord();
    } else if (!this.get(numberWithVersion)) {
      this.fetch(numberWithVersion);
    }
  }

}


const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
