import {
  BaseModel, identifiedBy, field, identifier,
} from 'shared/model';
import { computed } from 'mobx';
import moment from 'moment';
import { TimeStore } from '../../flux/time';

@identifiedBy('course/role')
export default class CourseRole extends BaseModel {
  @identifier id;

  @field({ type: 'date' }) joined_at;
  @field type;

  @computed get isStudent() {
    return this.type == 'student';
  }

  @computed get isTeacher() {
    return this.type == 'teacher';
  }

  joinedAgo(terms = 'days') {
    return moment(TimeStore.getNow()).diff(this.joined_at, terms);
  }
}
