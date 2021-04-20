export { model, field, computed } from 'shared/model';
import { extend, pick } from 'lodash';
import { BaseModel, computed } from 'shared/model';
import type { TourStep } from '../step'

export class BaseAction extends BaseModel {

    options: any
    step: TourStep

    constructor(options: any = {}) {
        super();
        this.options = options;
        this.step = this.options.step
        extend(this, pick(this.options, 'step', 'ride', 'selector'));
    }

    get document() {
        return window.document;
    }

    @computed get el() {
        return this.step.element;
    }

    $(selector: string) {
        return this.el?.querySelector(selector);
    }

    async beforeStep(_options?:any) {
        return Promise.resolve();
    }

    async afterStep(_options?:any) {
        return Promise.resolve();
    }

    // the default implementation does nothing
    preValidate() {}
}
