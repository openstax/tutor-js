import {
  computed, observable,
} from 'mobx';

import CoursePreviewUX from './preview-ux';

export default class CourseUX {

  @observable course;

  constructor(course) {
    this.course = course;
  }

  @computed get dataProps() {
    return {
      'data-title': this.course.name,
      'data-book-title': this.course.bookName,
      'data-appearance': this.course.appearance_code,
    };
  }

  @computed get courseType() {
    return this.course.is_concept_coach ? 'cc' : 'tutor';
  }

  @computed get courseId() {
    return this.course.isNew ? 'new' : this.course.id;
  }

  @computed get previewBehaviour() {
    return this.course.is_preview ? new CoursePreviewUX(this.course) : null;
  }
}
