import { TimeMock, Factory, ld, Time } from '../../helpers';
import Course from '../../../src/models/course'
import Student from '../../../src/models/course/student';
//import { bootstrapCoursesList } from '../../courses-test-data';
import Payments from '../../../src/models/payments';

jest.mock('../../../src/models/payments');

describe('Course Student', () => {
    let course: Course;
    const now = new Date('2000-01-01');
    TimeMock.setTo(now);

    beforeEach(() => {
        Payments.config.is_enabled = false
        course = Factory.course({ does_cost: true, is_preview: false })
    });

    test('#needsPayment', () => {
        course.students.push(Factory.bot.create('Student') as Student)
        const student = ld.last(course.students)!
        expect(student.isUnPaid).toBe(true)
        expect(student.needsPayment).toBe(false);
        Payments.config.is_enabled = true;
        expect(student.needsPayment).toBe(true);
        student.is_paid = true;
        expect(student.needsPayment).toBe(false);
        student.is_refund_pending = true;
        expect(student.needsPayment).toBe(true);
    });

    test('#mustPayImmediately', () => {
        Payments.config.is_enabled = true;
        course.students.push(Factory.bot.create('Student', { payment_due_at: '1999-12-30' }) as Student)
        const student = ld.last(course.students)!
        expect(student.needsPayment).toBe(true);
        expect(student.mustPayImmediately).toBe(true);
        student.payment_due_at = new Time('2000-01-02');
        expect(student.needsPayment).toBe(true);
        expect(student.mustPayImmediately).toBe(false);
    });
});
