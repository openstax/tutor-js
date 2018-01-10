import { pick } from 'lodash';
import { observable, computed, action } from 'mobx';
import {
  BaseModel, identifiedBy, field, identifier, hasMany,
} from '../base';

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

  // called from API
  save() {
    return pick(this, 'response');
  }

}
