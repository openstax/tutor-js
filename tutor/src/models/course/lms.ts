import {
    BaseModel, action, observable, computed, model, modelize, NEW_ID, field, getParentOf, hydrateInstance,
} from 'shared/model';
import urlFor from '../../api'
import type { Course } from '../../models'
import Time from 'shared/model/time';
import UiSettings from 'shared/model/ui-settings';

const LMS_VENDOR = 'lmsv';

export class CourseLMS extends BaseModel {

    @field id = NEW_ID;
    @observable key = '';
    @observable secret = '';
    @observable launch_url = '';
    @observable configuration_url = '';
    @observable xml = '';

    @model(Time) created_at = Time.unknown;
    @model(Time) updated_at = Time.unknown;

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
        const json = await this.api.request(urlFor('fetchCourseLMS', { courseId: this.course.id }))
        hydrateInstance(this, json)
    }

}
