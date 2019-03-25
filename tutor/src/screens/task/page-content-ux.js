import { observable, computed, action, observe } from 'mobx';

import BookUX from '../../models/reference-book/ux';

export default class PageContentUX extends BookUX {

  constructor({ main }) {
    super();
    this.mainUX = main;
  }

  @computed get page() {
    return this.mainUX.currentStep.isReading ? this.mainUX.currentStep.content.page : null;
  }

  @computed get courseDataProps() {
    const { course } = this.mainUX;
    return {
      'data-title': course.name,
      'data-book-title': course.bookName || '',
      'data-appearance': course.appearance_code,
    };

  }


  @action checkForTeacherContent() { }

}
