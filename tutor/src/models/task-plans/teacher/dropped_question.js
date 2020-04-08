import {
  BaseModel, identifiedBy, field, identifier,
} from 'shared/model';


@identifiedBy('task-plan/dropped-question')
class DroppedQuestion extends BaseModel {

  @identifier id;
  @field question_id;
  @field drop_method = 'zeroed';

}

export default DroppedQuestion;
