import {
  BaseModel, identifiedBy, identifier, field, identifier, hasMany,
} from '../model';
import Attachment from './exercise/attachment';
import Author from './exercise/author';
import Question from './exercise/question';
import Tag from './exercise/tag';

@identifiedBy('exercise')
export default class Exercise extends BaseModel {

  @identifier uuid;
  @field uid;
  @field version;
  @field({ type: 'array' }) versions;
  @field({ type: 'array' }) formats;
  @field is_vocab;
  @field number;

  @hasMany({ model: Attachment }) attachments;
  @hasMany({ model: Author }) authors;
  @hasMany({ model: Author })  copyright_holders;
  @hasMany({ model: Question }) questions;
  @hasMany({ model: Tag }) tags;


  //   [{id: 3, is_answer_order_important: false, stimulus_html: "", stem_html: "one",…}]
  // stimulus_html
  //   :
  //   ""
  //   tags
  //   :
  //   ["type:conceptual", "requires-context:true", "filter-type:test-prep", "blooms:3", "time:long", "dok:3",…]
  // uid
  //   :
  //   "1@1"
  //   uuid
  //   :
  //   "e74fc0af-5a18-4f3d-9cc6-2a3dbfc41cf9"
  //   version
  //   :
  //   1
  // versions
  //   :
  //   [1]


}
