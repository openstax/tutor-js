import {
  BaseModel, identifiedBy, identifier, belongsTo, field,
} from 'shared/model';

import {
  computed, action,
} from 'mobx';

import Markdown from 'markdown-it';
import MDRegex from 'markdown-it-regexp';

import Actions from './actions';

const MD = Markdown({ html: true, linkify: true, typographer: true });

MD.use(MDRegex(/:best-practices:/, () => '<i class="tour-step-best-practices"></i>' ));

// TourStep
// A step in a tour, where steps are connected by a “next” button that leads from one step to the next.
// Can be linked to either an anchor or region
// Has a title and rich text body.

export default
@identifiedBy('tour/step')
class TourStep extends BaseModel {
  @identifier id;

  @belongsTo tour;

  @field title;
  @field body;
  @field position;
  @field isCancelable = true;
  @field is_fixed;
  @field anchor_id;
  @field customComponent;
  @field spotlight = true;
  @field displayAs = 'standard';
  @field spotLightPadding = 5;
  @field requiredViewsCount = 1;
  @field displayWithButtons = true;
  @field({ type: 'object' }) action;
  @field className;

  @computed get target() {
    return this.anchor_id ? `[data-tour-anchor-id="${this.anchor_id}"]` : null;
  }

  get element() {
    return this.target ? document.querySelector(this.target) : null;
  }

  @computed get placement() {
    if (!this.element) { return 'center'; }
    return (this.anchor_id && this.position) ? this.position : 'auto';
  }

  @computed get isCentered() {
    return this.position == 'center';
  }

  @computed get actionClass() {
    if (!this.action) { return null; }
    return Actions.forIdentifier(this.action.id);
  }

  @computed get actionInstance() {
    return this.actionClass && new this.actionClass({
      step: this,
      ...this.action,
    });
  }

  @computed get shouldShowSpotlight() {
    return Boolean((this.anchor_id || this.isCentered) && this.spotlight);
  }

  @action complete() {
    return (this.actionInstance && this.actionInstance.afterStep()) || Promise.resolve();
    //      this.actionClass && this.actionClass
    // joyRideStep.action.afterStep();

  }

  @action prepare() {
    return (this.actionInstance && this.actionInstance.beforeStep()) || Promise.resolve();
  }

  get isViewable() {
    return Boolean(!this.target || this.element);
  }

  @computed get HTML() {
    return this.body ? MD.render(this.body) : '';
  }

  @computed get shouldReplay() {
    return this.requiredViewsCount > this.tour.viewCounts;
  }

  // @computed get joyrideStepProperties() {
  //   return {
  //     title: this.title,
  //     text:  this.HTML,
  //     isFixed: !!this.is_fixed,
  //     className: this.className,
  //     style: this.supersize ? { width: 1000, padding: 0 } : {},
  //     position: this.position || ( this.anchor_id ? 'top' : 'center' ),
  //   };
  // }
}
