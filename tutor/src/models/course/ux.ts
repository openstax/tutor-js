import { computed, observable, modelize } from 'shared/model'
import type { Course } from '../../models'

export class CourseUX {

    static get displayCourseCost() {
        return false;
    }

    static get formattedStudentCost() {
        return '$10';
    }

    @observable course: Course;

    constructor(course: Course) {
        modelize(this);
        this.course = course;
    }

    @computed get dataProps() {
        return {
            'data-title':       this.course.nameCleaned,
            'data-book-title':  this.course.bookName,
            'data-appearance':  this.course.appearance_code,
            'data-is-preview':  this.course.is_preview || false,
            'data-term':        this.course.termFull,
        };
    }

    @computed get courseType() {
        return this.course.is_concept_coach ? 'cc' : 'tutor';
    }

    @computed get courseId() {
        return this.course.isNew ? 'new' : this.course.id;
    }

    get formattedStudentCost() {
        return CourseUX.formattedStudentCost;
    }

}
