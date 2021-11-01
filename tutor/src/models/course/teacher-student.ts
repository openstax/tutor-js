import { CourseStudent } from '../../models'


export class CourseTeacherStudent extends CourseStudent {
    constructor() {
        super()
        // Override certain properties of CourseStudent
        this.name = 'Instructor Review';
        this.first_name = 'Instructor';
        this.last_name = 'Review';
        this.is_comped = true;
    }
}
