import { BaseModel, field, model, modelize, computed, NEW_ID } from 'shared/model';

export default class EcosystemBook extends BaseModel {
    @field id = NEW_ID;
    @field title;
    @field uuid;
    @field version;
    @model('ecosystems/ecosystem') ecosystem;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get titleWithVersion() {
        return `${this.title} ${this.version}`;
    }
}
