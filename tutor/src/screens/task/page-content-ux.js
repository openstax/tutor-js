import { computed, action } from 'mobx';

import BookUX from '../../models/reference-book/ux';

export default class PageContentUX extends BookUX {

    constructor({ main }) {
        super();
        this.mainUX = main;
        this.update({
            courseId: this.mainUX.course.id,
        });
    }

  @computed get course() {
        return this.mainUX.course;
    }

  @computed get page() {
      const step = this.mainUX.currentStep;
      return step.isReading ? step.content.page : null;
  }

  @computed get courseDataProps() {
      const { course } = this.mainUX;
      return {
          'data-title': course.name,
          'data-book-title': course.bookName || '',
          'data-appearance': course.appearance_code,
      };

  }

  rewriteBookLink(link) {
      link.target = '_blank';
  }

  @action checkForTeacherContent() { }

}
