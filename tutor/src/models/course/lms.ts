import {
    BaseModel, action, observable, computed, model, modelize, NEW_ID, field, getParentOf, hydrateInstance,
} from 'shared/model';
import Api from '../../api'
import type Course from '../course'
import DateTime from 'shared/model/date-time';
import UiSettings from 'shared/model/ui-settings';

const LMS_VENDOR = 'lmsv';

export default class CourseLMS extends BaseModel {

    @field id = NEW_ID;
    @observable key = '';
    @observable secret = '';
    @observable launch_url = '';
    @observable configuration_url = '';
    @observable xml = '';

    @model(DateTime) created_at = DateTime.unknown;
    @model(DateTime) updated_at = DateTime.unknown;

    get course():Course { return getParentOf(this) }

    constructor() {
        super()
        modelize(this)
    }

    @computed get vendor() {
        return UiSettings.get(LMS_VENDOR, this.course.id) || 'blackboard';
    }

    @action.bound setVendor(vendor: string) {
        return UiSettings.set(LMS_VENDOR, this.course.id, vendor);
    }

    async fetch() {
        const json = await this.api.request(Api.fetchCourseLMS({ courseId: this.course.id }))
        hydrateInstance(this, json)
    }

}
