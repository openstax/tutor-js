import { observable, computed, modelize } from 'shared/model'
import { readonly } from 'core-decorators';
import type { StudentTask } from '../../models'

const TITLES = {
    'individual-review-intro':  'Your individual review',
    'personalized-intro': 'Your individual review',
    'two-step-intro':    'Two step problems',
    'spaced-practice-intro': 'About spaced practice',
};

export
class StudentTaskInfoStep {

    constructor(info: any) {
        modelize(this);
        Object.assign(this, info);
    }
    @observable task?: StudentTask
    @observable wasViewed = false;
    @observable type = '';
    @readonly is_completed = true;
    @readonly needsFetched = false;
    @readonly isPlaceHolder = false;
    @readonly isInfo = true;
    fetchIfNeeded() { }
    markViewed() {}

    @computed get id() {
        return this.type;
    }
    api = {
        errors: {
            any: false,
        },
    }
    get preview() {
        return 'end' == this.type ? `${this.task?.title || 'Task'} Completed` : TITLES[this.type];
    }
}
