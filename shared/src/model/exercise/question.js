import {
  BaseModel, identifiedBy, identifier, field, identifier, hasMany,
} from '../../model';

import Answer from './answer';

@identifiedBy('exercise/question')
export default class ExerciseQuestion extends BaseModel {

  @identifier id;
  @hasMany({ model: Answer, inverseOf: 'question'  });
  @hasMany({ model: Solution, inverseOf: 'question' });
  @field is_answer_order_important;
  @field stem_html;
  @field stimulus_html;

  //
  //   answers
  //     :
  //     [{id: 3, content_html: "two", correctness: "1.0", feedback_html: "three"}]
  //   collaborator_solutions
  //     :
  //     [{attachments: [], solution_type: "detailed", content_html: "four"}]
  //   combo_choices
  //     :
  //     []
  //   community_solutions
  //     :
  //     []
  //   formats
  //     :
  //     ["free-response", "multiple-choice"]
  //   hints
  //     :
  //     []
  //   id
  //     :
  //     3
  //   is_answer_order_important
  //     :
  //     false
  //   stem_html
  //     :
  //     "one"
  //     stimulus_html
  //     :
  //     ""

}
