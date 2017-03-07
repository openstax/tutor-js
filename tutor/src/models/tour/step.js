import {
  BaseModel, identifiedBy, identifier, belongsTo, field,
} from '../base';

import {
  computed,
} from 'mobx';

import Markdown from 'markdown-it';
const MD = Markdown({ html: true, linkify: true, typographer: true });

@identifiedBy('tour/step')
export default class TourStep extends BaseModel {
  @identifier id;

  @belongsTo tour;

  @field setup_action;
  @field teardown_action;

  @field title;
  @field content;

  @field anchor_id;

  @computed get HTML() {
    return MD.render(this.content);
  }
}
