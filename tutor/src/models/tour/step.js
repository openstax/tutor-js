import {
  BaseModel, identifiedBy, identifier, belongsTo, field,
} from '../base';

import {
  computed,
} from 'mobx';

import Markdown from 'markdown-it';
const MD = Markdown({ html: true, linkify: true, typographer: true });
import Actions from './actions';

// TourStep
// A step in a tour, where steps are connected by a “next” button that leads from one step to the next.
// Can be linked to either an anchor or region
// Has a title and rich text body.

@identifiedBy('tour/step')
export default class TourStep extends BaseModel {
  @identifier id;

  @belongsTo tour;

  @field title;
  @field content;
  @field position;

  @field anchor_id;
  @field({ type: 'object' }) action;

  @computed get actionClass() {
    if (!this.action) { return null; }
    return Actions.forIdentifier(this.action.id);
  }

  @computed get HTML() {
    return MD.render(this.content);
  }

  @computed get joyrideStepProperties() {
    return {
      title: this.title,
      text:  this.HTML,
      position: this.position || 'top',
    };
  }
}
