import { BaseModel, field, modelize, computed, action, NEW_ID, getParentOf } from 'shared/model';
import { isEmpty, intersection } from 'lodash';
import Markdown from 'markdown-it';
import MDRegex from 'markdown-it-regexp';
import Actions from './actions';
import WindowSize from '../window-size';
import type Tour from '../tour'

const MD = Markdown({ html: true, linkify: true, typographer: true });
MD.use(MDRegex(/:best-practices:/, () => '<i class="tour-step-best-practices"></i>' ))

// TourStep
// A step in a tour, where steps are connected by a “next” button that leads from one step to the next.
// Can be linked to either an anchor or region
// Has a title and rich text body.

export default class TourStep extends BaseModel {
    @field id = NEW_ID;

    @field title = '';
    @field body = '';
    @field position = '';
    @field isCancelable = true;
    @field is_fixed = false;
    @field anchor_id: string | null = null;
    @field customComponent: any;
    @field spotlight = true;
    @field displayAs = 'standard';
    @field spotLightPadding = 5;
    @field requiredViewsCount = 1;
    @field displayWithButtons = true;
    @field action?: any;
    @field className?: string;
    @field disabledBreakpoints?: any[];

    windowSize = new WindowSize();

    constructor() {
        super();
        modelize(this);
    }

    get tour() { return getParentOf<Tour>(this) }

    @computed get target() {
        return this.anchor_id ? `[data-tour-anchor-id="${this.anchor_id}"]` : null;
    }

    get element(): HTMLElement | null {
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

    @action preValidate() {
        this.actionInstance && this.actionInstance.preValidate();
    }

    @action prepare(options: any) {
        return (this.actionInstance && this.actionInstance.beforeStep(options)) || Promise.resolve();
    }

    @action complete(options: any) {
        return (this.actionInstance && this.actionInstance.afterStep(options) ) || Promise.resolve();
    }

    get isViewable() {
        if (!isEmpty(intersection(this.disabledBreakpoints, [this.windowSize.currentBreakpoint]))) {
            return false;
        }
        return Boolean(!this.target || this.element);
    }

    @computed get HTML() {
        return this.body ? MD.render(this.body) : '';
    }

    @computed get shouldReplay() {
        return this.requiredViewsCount > this.tour.viewCounts;
    }
}
