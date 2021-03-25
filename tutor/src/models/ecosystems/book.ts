import { computed } from 'mobx';
import { BaseModel, field, identifier, belongsTo, modelize } from 'shared/model';

export default class EcosystemBook extends BaseModel {
    @identifier id;
    @field title;
    @field uuid;
    @field version;
    @belongsTo({ model: 'ecosystems/ecosystem' }) ecosystem;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get titleWithVersion() {
        return `${this.title} ${this.version}`;
    }
}
