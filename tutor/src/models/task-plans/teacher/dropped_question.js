import {
  BaseModel, identifiedBy, field, identifier, action,
} from 'shared/model';
import { observable } from 'mobx';

@identifiedBy('task-plan/dropped-question')
class DroppedQuestion extends BaseModel {

  @identifier id;
  @field question_id;
  @field drop_method = 'zeroed';
  @observable isChanged;

  @action.bound setDropMethod(method) {
    this.drop_method = method;
    this.isChanged = true;
  }

}

export default DroppedQuestion;
