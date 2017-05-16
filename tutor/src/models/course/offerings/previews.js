import { filter, pick, sortBy, find } from 'lodash';
import { action } from 'mobx';
import {
  BaseModel, identifiedBy, session, identifier, field, belongsTo, computed,
} from '../../base';
import Course from '../../course';
import Courses from '../../courses-map';
import Offerings from './index';

@identifiedBy('course/offerings/preview')
export class PreviewCourseOffering extends Course {

  constructor(offering) {
    super({
      id: `preview-${offering.id}`,
      offering_id: offering.id,
      name: offering.title,
      appearance_code: offering.appearance_code,
      is_preview: true,
      roles: [ { type: 'teacher' }],
    });
  }

  @computed get isCreated() {
    return !!this.previewCourse;
  }

  @computed get previewCourse() {
    return find(Courses.array, { offering_id: this.offering_id, is_preview: true });
  }

}


export default {

  @action fetch() {
    Offerings.fetched;
  },

  @computed get all() {
    const tutor = sortBy(filter(Offerings.fetched.array, 'is_tutor'), 'title');
    return tutor.map(o => new PreviewCourseOffering(o));
  },

};
