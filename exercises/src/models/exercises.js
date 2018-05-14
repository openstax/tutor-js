import Map from 'shared/model/map';
import { sortBy, last, get } from 'lodash';
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
    if (id === NEW) { return super.get(id); }
    const versions = super.get(id);
    return versions ? versions.get(version) : null;
  }

  fetch(id) {
    if (!String(id).match(/@/)){ id = `${id}@latest`; }
    return { id };
  }

  @action onLoaded({ data, exercise }) {
    let versions = super.get(data.number);
    if (!versions) {
      versions = new ExerciseVersions();
      this.set(data.number, versions);
    }
    let existing = versions.get(data.version);
    if (exercise) {
      versions.set(data.version, exercise);
      existing = exercise;
    }
    existing ? existing.update(data) : versions.set(data.version, exercise || new Exercise(data));
  }

  @action ensureLoaded(numberWithVersion) {
    if (numberWithVersion === NEW) {
      this.findOrCreateNewRecord();
    } else if (!this.get(numberWithVersion)) {
      this.fetch(numberWithVersion);
    }
  }

  publish(exercise) {
    return { uid: exercise.uid, data: exercise.serialize() };
  }

  saveDraft(exercise) {
    const req = { data: exercise.serialize() };
    if (exercise.isNew) {
      Object.assign(req, { url: 'exercises', method: 'POST' });
    }
    return req;
  }

  onSaved({ data }, [exercise]) {
    exercise.error = null;
    this.onLoaded({ data, exercise });
  }

  onError(error, [exercise]) {
    exercise.error = get(error, 'response.data.errors[0].message', error);
  }

}


const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
