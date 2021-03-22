import {
    BaseModel, modelize, observable, computed,
} from '../../model';


export default
class ExerciseFormat extends BaseModel {

    @observable _format;

    constructor(format: string) {
        super();
        this._format = format;
        modelize(this)
    }

    serialize() {
        return this.asString
    }

    @computed get asString() {
        return this._format;
    }

    @computed get value() {
        return this.asString;
    }

    set value(v) {
        this._format = v;
    }

}
