import { bootstrapCoursesList } from '../../courses-test-data';
import Purchase from '../../../src/models/purchases/purchase';

describe('Purchase Model', () => {
    let course, purchase;

    beforeEach(() => {
        course = bootstrapCoursesList().get('1');
        purchase = new Purchase({ product_instance_uuid: course.userStudentRecord.uuid });
    });

    test('#course', () => {
        expect(purchase.course).toBe(course);
    });

    test('#onRefunded', () => {
        purchase.onRefunded();
        expect(course.userStudentRecord.is_paid).toBe(false);
        expect(course.userStudentRecord.prompt_student_to_pay).toBe(true);
    });

});
