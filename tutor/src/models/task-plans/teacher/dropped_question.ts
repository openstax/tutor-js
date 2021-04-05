import { BaseModel, model, ID, field, action, modelize, observable, NEW_ID } from 'shared/model';
import DateTime from 'shared/model/date-time'


class DroppedQuestion extends BaseModel {
    @field id = NEW_ID;
    @field question_id:ID = '';
    @field drop_method = 'zeroed';
    @model(DateTime) updated_at = DateTime.unknown;
    @observable isChanged = false;

    constructor() {
        super();
        modelize(this);
    }

    @action.bound setDropMethod(method: string) {
        this.drop_method = method;
        this.isChanged = true;
    }
}

export default DroppedQuestion;
