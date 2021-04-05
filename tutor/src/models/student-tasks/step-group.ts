import { BaseModel, model, computed, action, field, NEW_ID, array } from 'shared/model';
import StudentTaskStep from './step'
import { readonly } from 'core-decorators';

interface StudentTaskStepGroupKey {
    id: string
    uid: string
    type: string
}

export default class StudentTaskStepGroup extends BaseModel {

    @field uid = NEW_ID;
    @model(StudentTaskStep) steps = array<StudentTaskStep>()

    @readonly isGrouped = true;
    @readonly type = 'mpq';

    static key(s: StudentTaskStepGroupKey) {
        return `${s.type}.${s.uid || s.id}`;
    }

    constructor() {
        super()
        this.steps.forEach((s) => s.multiPartGroup = this)
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
