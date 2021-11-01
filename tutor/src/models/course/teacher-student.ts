import { modelize } from 'shared/model';
import { CourseStudent } from '../../models'


export class CourseTeacherStudent extends CourseStudent {
    name = 'Instructor Review';
    first_name = 'Instructor';
    last_name = 'Review';
    is_comped = true;

    constructor() {
        super()
        modelize(this)
    }
}
