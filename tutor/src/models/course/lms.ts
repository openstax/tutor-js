import { BaseModel, identifier, action, observable, computed, model, modelize } from 'shared/model';
import DateTime from 'shared/model/date-time';
import UiSettings from 'shared/model/ui-settings';

const LMS_VENDOR = 'lmsv';

export default class CourseLMS extends BaseModel {
    @observable course;

    @identifier id;
    @observable key;
    @observable secret;
    @observable launch_url;
    @observable configuration_url;
    @observable xml;

    @model(DateTime) created_at = DateTime.unknown;
    @model(DateTime) updated_at = DateTime.unknown;

    @model('course') course;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    @computed get vendor() {
        return UiSettings.get(LMS_VENDOR, this.course.id) || 'blackboard';
    }

    @action.bound setVendor(vendor) {
        return UiSettings.set(LMS_VENDOR, this.course.id, vendor);
    }

    // called by API
    pushScores() {}
    fetch() { }
}
