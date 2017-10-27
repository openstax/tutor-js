import { action, observable, computed } from 'mobx';
import {
  BaseModel, identifiedBy, identifier, session, belongsTo,
} from '../base';
import { UiSettings } from 'shared';

const LMS_VENDOR = 'lmsv';

@identifiedBy('course/lms')
export default class CourseLMS extends BaseModel {

  @observable course;

  @identifier id;
  @session key;
  @session secret;
  @session launch_url;
  @session configuration_url;
  @session xml;

  @session({ type: 'date' }) created_at;
  @session({ type: 'date' }) updated_at;

  @belongsTo({ model: 'course' }) course;

  @computed get vendor() {
    return UiSettings.get(LMS_VENDOR, this.course.id) || 'blackboard';
  }

  @action.bound setVendor(vendor) {
    console.log(vendor)
    return UiSettings.set(LMS_VENDOR, this.course.id, vendor);
  }

  // called by API
  pushScores() {}
  fetch() { }

}
