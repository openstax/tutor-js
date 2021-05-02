import { BaseModel, field, modelize, computed, NEW_ID, getParentOf } from 'shared/model';
import type { Ecosystem } from '../../models'

export class EcosystemBook extends BaseModel {
    @field id = NEW_ID;
    @field title = '';
    @field uuid = '';
    @field version = '';

    get ecosystem() { return getParentOf<Ecosystem>(this) }

    constructor() {
        super();
        modelize(this);
    }

    @computed get titleWithVersion() {
        return `${this.title} ${this.version}`;
    }
}
