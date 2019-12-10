import Map from 'shared/model/map';
import {
  BaseModel, identifiedBy, action, field, identifier,
} from 'shared/model';


export default
@identifiedBy('grading/template')
class GradingTemplate extends BaseModel {

  @identifier id;

  @field name;

  constructor(attrs, map) {
    super(attrs);
    this.map = map;
  }

}


export class GradingTemplates extends Map {

  static Model = GradingTemplate;

  // called by API
  fetch() { }

  @action onLoaded({ data }) {
    this.mergeModelData(data);
  }

}
