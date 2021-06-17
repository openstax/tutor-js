import { BaseModel, observable, modelize, computed, action, field, NEW_ID, hydrateInstance } from 'shared/model';
import { StudentTaskStep } from '../../models'
import { readonly } from 'core-decorators';

interface StudentTaskStepGroupKey {
    id: string
    uid: string
    type: string
}

export class StudentTaskStepGroup extends BaseModel {


    @field uid = NEW_ID;
    // DO NOT convert to @model
    // doing so will re-assign the step's parent if they're added to it
    @observable steps:StudentTaskStep[] = []

    @readonly isGrouped = true;
    @readonly type = 'mpq';

    static key(s: StudentTaskStepGroupKey) {
        return `${s.type}.${s.uid || s.id}`;
    }

    static hydrate(attrs: any) {
        const stg = new StudentTaskStepGroup()
        hydrateInstance(stg, attrs)
        stg.steps.forEach((s) => s.multiPartGroup = stg)
        return stg
    }

    constructor() {
        super()
        modelize(this)
    }

    @computed get needsFetched() {
        return Boolean(this.steps.find(s => s.needsFetched));
    }

    getStepAfter(step: StudentTaskStep) {
        const indx = this.steps.indexOf(step);
        if (indx != -1 && indx < this.steps.length - 1) {
            return this.steps[indx + 1];
        }
        return null;
    }

    fetchIfNeeded() {
        return this.steps.map(s => s.fetchIfNeeded());
    }

    @action markViewed() {
        this.steps.forEach(s => s.markViewed());
    }

    includesStep(step: StudentTaskStep) {
        return -1 !== this.steps.indexOf(step);
    }
}
