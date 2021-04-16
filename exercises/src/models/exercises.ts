import Map from 'shared/model/map';
import { action, ID, hydrateModel, hydrateInstance } from 'shared/model';
import { sortBy, last, get } from 'lodash';
import Exercise from './exercises/exercise';
import urlFor  from '../api'

const NEW = 'new';

export class ExerciseVersions extends Map<ID, Exercise> {
    id: string = ''

    update(){}

    coerceValue(v: Exercise): Exercise {
        return v
    }

    get(version: ID) {
        if (version === 'latest') {
            return last(sortBy(this.array, 'version'));
        } else {
            return super.get(version);
        }
    }

}

export class ExercisesMap extends Map<ID, Exercise | ExerciseVersions> {

    createNewRecord(): Exercise {
        const ex = Exercise.build({ id: NEW });
        this.set(NEW, ex);
        return ex;
    }

    findOrCreateNewRecord() {
        return this.get(NEW) || this.createNewRecord();
    }

    get(idWithVersion: string): Exercise | undefined {
        const [id, version = 'latest'] = String(idWithVersion).split('@');
        if (id === NEW) { return super.get(id) as Exercise || this.createNewRecord(); }
        const versions = super.get(id) as ExerciseVersions;
        return versions ? versions.get(version) : undefined;
    }

    coerceValue(v: Exercise | ExerciseVersions): Exercise | ExerciseVersions {
        return v
    }

    async fetch(id: string): Promise<any>{
        if (!String(id).match(/@/)){ id = `${id}@latest`; }
        const data = await this.api.request<Exercise>(urlFor('exercise', { uid: id }))
        this.onLoaded({ data })
    }

    @action onLoaded({ data, exercise }: { data: any, exercise?:Exercise }) {
        const [number, version ] = data.uid.split('@')
        let versions = super.get(number) as ExerciseVersions;
        if (!versions) {
            versions = new ExerciseVersions();
            this.set(number, versions);
        }
        let existing = versions.get(version);
        if (exercise) {
            versions.set(version, exercise);
            exercise.published_at = data.published_at;
            existing = exercise;
        }
        existing ? hydrateInstance(existing, data) : versions.set(version, exercise || hydrateModel(Exercise, data));
    }

    async ensureLoaded(numberWithVersion: string): Promise<any> {
        if (numberWithVersion === NEW) {
            this.findOrCreateNewRecord();
        } else if (!this.get(numberWithVersion)) {
            this.fetch(numberWithVersion);
        }
    }

    publish(exercise: Exercise) {
        const data = exercise.toJSON()
        return { uid: exercise.uid, data } ;
    }

    async saveDraft(exercise: Exercise) {
        let url: any
        if (exercise.isNew) {
            url = urlFor('saveNewDraft');
        } else {
            url = urlFor('saveExistingDraft', { number: exercise.number })
        }
        this.onSaved(
            await this.api.request(url, exercise.toJSON()),
            exercise
        )
    }

    @action onSaved(data: Exercise, exercise: Exercise) {
        exercise.error = null;
        this.onLoaded({ data, exercise });
    }

    @action onError(error: any, [exercise]: Exercise[]) {
        exercise.onError(get(error, 'response.data.errors[0].message', error.message));
    }

}


const exercisesMap = new ExercisesMap();

export { Exercise };
export default exercisesMap;
