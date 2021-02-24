import { pick } from 'lodash';
import { computed } from 'mobx';
import {
    BaseModel, identifiedBy, field, identifier,
} from 'shared/model';

@identifiedBy('student/task')
export default class ResearchSurvey extends BaseModel {

  @identifier id;
  @field title;
  @field({ type: 'object' }) model;
  @field response;

  @computed get surveyJS() {
      // yuck, but we have to deal with the "json" provided by the surveyjs editor
      return eval(`(${this.model})`);
  }

  @computed get isComplete() {
      return Boolean(this.response && !this.api.isPending);
  }

  // called from API
  save() {
      return { id: this.id, data: pick(this, 'response') };
  }

}
