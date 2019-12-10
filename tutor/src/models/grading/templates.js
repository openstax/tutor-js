import Map from 'shared/model/map';
import {
  BaseModel, identifiedBy, action, field, identifier,
} from 'shared/model';


@identifiedBy('grading/template')
class GradingTemplate extends BaseModel {

  @identifier id;
  @field type;
  @field name;

  constructor(attrs, map) {
    super(attrs);
    this.map = map;
  }

}


class GradingTemplates extends Map {

  static Model = GradingTemplate;

  // called by API
  fetch() {
    // TODO remove once api is setup
    this.onLoaded({
      data: [
        { id: 1, name: 'Reading',  type: 'reading' },
        { id: 2, name: 'Homework', type: 'homework' },
      ],
    });
  }

  @action onLoaded({ data }) {
    this.mergeModelData(data);
  }

}

export { GradingTemplate, GradingTemplates };
