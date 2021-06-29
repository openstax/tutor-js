import { Purchase, Course } from '../../../src/models'
import { Factory, hydrateModel, ApiMock } from '../../helpers'

describe('Purchase Model', () => {
    let course!:Course
    let purchase!:Purchase;

    beforeEach(() => {
        const courses = Factory.coursesMap({ is_teacher: false })
        course = courses.array[0]
        purchase = hydrateModel(Purchase, { product_instance_uuid: course.userStudentRecord!.uuid })
        purchase.courses = courses
    });

    test('#course', () => {
        expect(purchase.course).toBe(course)
    });

    test('#onRefunded', async () => {
        ApiMock.mock({
            [`purchases/${purchase.product_instance_uuid}/refund`]: { ok: true },
        })
        await purchase.refund();
        expect(course.userStudentRecord!.is_paid).toBe(false);
        expect(course.userStudentRecord!.prompt_student_to_pay).toBe(true);
    });

});
