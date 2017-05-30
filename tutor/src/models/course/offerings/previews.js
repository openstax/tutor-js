import { filter, sortBy, find } from 'lodash';
import { action, observable, computed } from 'mobx';
import { identifiedBy } from '../../base';
import Course from '../../course';
import Courses from '../../courses-map';
import Offerings from './index';
import CourseCreate from '../create';

@identifiedBy('course/offerings/preview')
export class PreviewCourseOffering extends Course {
  @observable isBuilding = false;
  @observable offering;

  constructor(offering) {
    super({
      id: `preview-${offering.id}`,
      offering_id: offering.id,
      name: offering.title,
      appearance_code: offering.appearance_code,
      is_preview: true,
      roles: [ { type: 'teacher' }],
    });
    this.offering = offering;
  }


  @computed get isCreated() {
    return !!this.previewCourse;
  }

  @computed get previewCourse() {
    return find(Courses.active.array, { offering_id: this.offering_id, is_preview: true });
  }

  @action build() {
    if (this.isBuilding) { return Promise.resolve(this); }
    this.isBuilding = true;

    return new Promise((resolve) => {
      const create = new CourseCreate({
        name: `${this.name} Preview`,
        is_preview: true,
        offering_id: this.offering_id,
        term: this.offering.currentTerm,
      });
      create.save().then(() => {
        this.isBuilding = false;
        resolve(create.createdCourse);
      }, () => (this.isBuilding = false));
    });

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
