import { pick } from 'lodash';
import { computed } from 'mobx';
import { BaseModel, field, identifier, modelize } from 'shared/model';

export default class ResearchSurvey extends BaseModel {
    @identifier id;
    @field title;
    @field({ type: 'object' }) model;
    @field response;

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
