import { modelize } from 'shared/model';
import { BookUX } from '../../helpers/reference-book-base-ux'

export default class PageContentUX extends BookUX {

    constructor({ main }) {
        super();
        modelize(this);
        this.mainUX = main;
        this.update({
            courseId: this.mainUX.course.id,
        });
    }

    get course() {
        return this.mainUX.course;
    }

    get page() {
        const step = this.mainUX.currentStep;
        return step.isReading ? step.content.page : null;
    }

    get courseDataProps() {
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

}
