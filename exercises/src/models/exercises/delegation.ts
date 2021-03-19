import { BaseModel, identifiedBy, field } from 'shared/model';


@identifiedBy('exercise/delegation')
export default
class ExerciseDelegation extends BaseModel {
  @field delegator_id;

  @field delegate_id;
  @field delegate_type;

  @field can_assign_authorship;
  @field can_assign_copyright;
  @field can_read;
  @field can_update;
}
