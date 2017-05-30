import {
  computed, observable,
} from 'mobx';

export default class BasicCourseUX {

  @observable course;

  constructor(course) {
    this.course = course;
  }

  @computed get dataProps() {
    return {
      'data-title':       this.course.nameCleaned,
      'data-book-title':  this.course.bookName,
      'data-appearance':  this.course.appearance_code,
      'data-is-preview':  this.course.is_preview,
      'data-term':        this.course.termFull
    };
  }

  @computed get courseType() {
    return this.course.is_concept_coach ? 'cc' : 'tutor';
  }

  @computed get courseId() {
    return this.course.isNew ? 'new' : this.course.id;
  }

  get formattedStudentCost() {
    return '$10';
  }

  onTaskPlanPublish(plan) { }

}
