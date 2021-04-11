import { bootstrapCoursesList } from '../../courses-test-data';
import Purchase from '../../../src/models/purchases/purchase';
import Course from '../../../src/models/course';
import { hydrateModel } from 'modeled-mobx';

describe('Purchase Model', () => {
    let course!:Course
    let purchase!:Purchase;

    beforeEach(() => {
        course = bootstrapCoursesList().get('1')!
        purchase = hydrateModel(Purchase, { product_instance_uuid: course.userStudentRecord!.uuid })
    });

    test('#course', () => {
        expect(purchase.course).toBe(course)
    });

    test('#onRefunded', () => {
        purchase.onRefunded();
        expect(course.userStudentRecord!.is_paid).toBe(false);
        expect(course.userStudentRecord!.prompt_student_to_pay).toBe(true);
    });

});
