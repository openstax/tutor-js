import { TimeMock, Factory, Time } from '../../helpers';
import { FeatureFlagsApi, Course, CourseStudent } from '../../../src/models'

// jest.mock('../../../src/models/payments');

describe('Course Student', () => {
    let course: Course;
    const now = new Date('2000-01-01');
    TimeMock.setTo(now);

    beforeEach(() => {
        FeatureFlagsApi.set('is_payments_enabled', false)
        course = Factory.course({ does_cost: true, is_preview: false })
    });

    test('#needsPayment', () => {
        course.student_record = Factory.bot.create('Student') as CourseStudent
        const student = course.student_record
        expect(student.isUnPaid).toBe(true)
        expect(student.needsPayment).toBe(false);
        FeatureFlagsApi.set('is_payments_enabled', true)
        //Payments.config.is_enabled = true;
        expect(student.needsPayment).toBe(true);
        student.is_paid = true;
        expect(student.needsPayment).toBe(false);
        student.is_refund_pending = true;
        expect(student.needsPayment).toBe(true);
    });

    test('#mustPayImmediately', () => {
        FeatureFlagsApi.set('is_payments_enabled', true)
        //Payments.config.is_enabled = true;
        course.student_record = Factory.bot.create(
            'Student', { payment_due_at: '1999-12-30' }
        ) as CourseStudent
        const student = course.student_record
        expect(student.needsPayment).toBe(true);
        expect(student.mustPayImmediately).toBe(true);
        student.payment_due_at = new Time('2000-01-02');
        expect(student.needsPayment).toBe(true);
        expect(student.mustPayImmediately).toBe(false);
    });
});
