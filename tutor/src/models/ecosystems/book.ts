import { BaseModel, field, modelize, computed, NEW_ID, getParentOf } from 'shared/model';


export default class EcosystemBook extends BaseModel {
    @field id = NEW_ID;
    @field title = '';
    @field uuid = '';
    @field version = '';

    get ecosystem() { return getParentOf<this>(this) }

    constructor() {
        super();
        modelize(this);
    }

    @computed get titleWithVersion() {
        return `${this.title} ${this.version}`;
    }
}
