import { sortBy, find } from 'lodash';
import { action, observable, computed, decorate } from 'mobx';
import { identifiedBy } from 'shared/model';
import Course from '../../course';
import Courses from '../../courses-map';
import Offerings from './index';
import CourseCreate from '../create';

export { PreviewCourseOffering };

@identifiedBy('course/offerings/preview')
class PreviewCourseOffering extends Course {

  @observable offering;
  @observable courseCreate;

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

  @computed get isBuilding() {
    return !!(this.courseCreate && this.courseCreate.api.isPending);
  }

  @action build() {
    if (this.isBuilding) { return Promise.resolve(this.courseCreate); }
    this.courseCreate = new CourseCreate({
      name: this.name,
      is_preview: true,
      offering_id: this.offering_id,
      term: this.offering.currentTerm,
    });
    return this.courseCreate.save();
  }

}


const Previews = {

  fetch() {
    Offerings.fetched;
  },

  get all() {
    const tutor = sortBy(Offerings.fetched.previewable.array, 'title');
    return tutor.map(o => new PreviewCourseOffering(o));
  },

};

decorate(Previews, {
  fetch: action,
  all: computed,
});

export default Previews;
