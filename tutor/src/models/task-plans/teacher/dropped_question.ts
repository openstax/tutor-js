import { BaseModel, model, ID, field, action, modelize, observable, NEW_ID } from 'shared/model';
import { Exercise } from '../../../models';
import Time from 'shared/model/time'

export class DroppedQuestion extends BaseModel {
    @field id = NEW_ID;
    @field question_id: ID = '';
    @field drop_method = 'zeroed';
    @model(Time) updated_at = Time.unknown;
    @observable isChanged = false;
    @observable excluded = false;
    @observable exercise!: Exercise;

    constructor() {
        super();
        modelize(this);
    }

    @action.bound setDropMethod(method: string) {
        this.drop_method = method;
        this.isChanged = true;
    }

    @action.bound setExcluded(value: boolean) {
        this.excluded = value
        this.isChanged = true
    }
}
