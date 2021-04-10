import { pick } from 'lodash';
import { BaseModel, field, modelize, computed, NEW_ID } from 'shared/model';

export default class ResearchSurvey extends BaseModel {
    @field id = NEW_ID;
    @field title = '';
    @field model?: any;
    @field response?: any;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

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
