import { BaseModel, field, action, modelize, observable, NEW_ID } from 'shared/model';

class DroppedQuestion extends BaseModel {
    @field id = NEW_ID;
    @field question_id;
    @field drop_method = 'zeroed';
    @field updated_at;
    @observable isChanged;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @action.bound setDropMethod(method) {
        this.drop_method = method;
        this.isChanged = true;
    }
}

export default DroppedQuestion;
