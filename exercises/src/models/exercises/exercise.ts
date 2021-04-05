import { action } from 'mobx';
import { merge, find, isEmpty, isObject, map } from 'lodash';
import { modelize, model, hydrateModel, observable } from 'shared/model';
import Image from './image';
import Delegation from './delegation';
import SharedExercise from 'shared/model/exercise';
import CurrentUser from '../user';


export default
class Exercise extends SharedExercise {

    static build(attrs: any) {
        return hydrateModel(Exercise, merge(attrs, {
            questions: [{
                formats: [],
            }],
        }));
    }
    @observable error?:any;
    @model(Image) images:Image[] = []
    @model(Delegation) delegations: Delegation[] = []

    constructor() {
        super()
        modelize(this)
    }

    @action onError(message: any) {
        this.error = message;
    }

    get errorMessage() {
        if (isEmpty(this.error)) { return ''; }
        if (isObject(this.error)) {
            return map(this.error, (v: any, k: string) => `${k}: ${v}`).join('; ');
        }
        return this.error; // hope react can render whatever it is
    }

    get readOnlyReason() {
        if (this.isNew) { return null; } // new records can always be edited
        const userId = CurrentUser.id;
        if (!find(this.authors.concat(this.copyright_holders), { user_id: userId }) &&
            !find(this.delegations, { delegate_id: userId, delegate_type: 'User', can_update: true })) {
            return `Author: ${this.authors.map(a => a.name).join(',')}`;
        }
        return null;
    }

    get canEdit() {
        return !this.readOnlyReason;
    }
}
