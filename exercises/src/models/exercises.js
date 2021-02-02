import Map from 'shared/model/map';
import { sortBy, last, get } from 'lodash';
import { action } from 'mobx';
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

  createNewRecord() {
    const ex = Exercise.build({ id: NEW });
    this.set(NEW, ex);
    return ex;
  }

  findOrCreateNewRecord() {
    return this.get(NEW) || this.createNewRecord();
  }

  get(idWithVersion) {
    const [id, version = 'latest'] = String(idWithVersion).split('@');
    if (id === NEW) { return super.get(id) || this.createNewRecord(); }
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
      exercise.published_at = data.published_at;
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

  saveDraft(exercise, blob) {
    const req = { data: exercise.serialize() };
    req.data.images = [blob.signed_id];
    if (exercise.isNew) {
      Object.assign(req, { url: 'exercises', method: 'POST' });
    } else {
      Object.assign(req, { number: exercise.number });
    }
    console.log(req)
    return req;
  }

  onSaved({ data }, [exercise]) {
    exercise.error = null;
    this.onLoaded({ data, exercise });
  }

  onError(error, [exercise]) {
    exercise.onError(get(error, 'response.data.errors[0].message', error.message));
  }

}


const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
