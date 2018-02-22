pppimport {
  BaseModel, identifiedBy, identifier, field, identifier, hasMany,
} from '../../model';


@identifiedBy('exercise/tag')
export default class ExerciseTag extends BaseModel {

  @identifier id;
  @hasMany({ model: Answer });
  @hasMany({ model: Solution });
  @field is_answer_order_important;
  @field stem_html;
  @field stimulus_html;

}
