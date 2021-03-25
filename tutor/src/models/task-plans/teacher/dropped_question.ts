import { BaseModel, identifiedBy, field, identifier, action, modelize } from 'shared/model';
import { observable } from 'mobx';

@identifiedBy('task-plan/dropped-question')
class DroppedQuestion extends BaseModel {
    @identifier id;
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
