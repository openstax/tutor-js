import {
  BaseModel, identifiedBy, identifier, belongsTo, field,
} from '../base';

import {
  computed,
} from 'mobx';

import Markdown from 'markdown-it';
import MDRegex from 'markdown-it-regexp';

import Actions from './actions';

const MD = Markdown({ html: true, linkify: true, typographer: true });

MD.use(MDRegex(/\:best-practices\:/, () => '<i class="tour-step-best-practices"></i>' ));

// TourStep
// A step in a tour, where steps are connected by a “next” button that leads from one step to the next.
// Can be linked to either an anchor or region
// Has a title and rich text body.

@identifiedBy('tour/step')
export default class TourStep extends BaseModel {
  @identifier id;

  @belongsTo tour;

  @field title;
  @field body;
  @field position;
  @field is_fixed;
  @field anchor_id;
  @field supersize;
  @field component;
  @field customComponent;
  @field({ type: 'object' }) action;

  @computed get actionClass() {
    if (!this.action) { return null; }
    return Actions.forIdentifier(this.action.id);


  }

  @computed get HTML() {
    return this.body ? MD.render(this.body) : '';
  }

  @computed get joyrideStepProperties() {
    return {
      title: this.title,
      text:  this.HTML,
      isFixed: !!this.is_fixed,
      style: this.supersize ? { width: 1000, padding: 0 } : {},
      position: this.position || ( this.anchor_id ? 'top' : 'center' ),
    };
  }
}
