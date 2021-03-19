import { TimeMock } from '../../helpers';
import Student from '../../../src/models/course/student';
import { bootstrapCoursesList } from '../../courses-test-data';
import Payments from '../../../src/models/payments';

jest.mock('../../../src/models/payments');

describe('Course Student', () => {
    let course;
    const now = new Date('2000-01-01');
    TimeMock.setTo(now);

    beforeEach(() => {
        Payments.config = { is_enabled: false };
        course = bootstrapCoursesList().get('1');
    });

    test('#needsPayment', () => {
        const student = new Student({ course });
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
        const student = new Student({ payment_due_at: '1999-12-30', course });
        expect(student.needsPayment).toBe(true);
        expect(student.mustPayImmediately).toBe(true);
        student.payment_due_at = new Date('2000-01-02');
        expect(student.needsPayment).toBe(true);
        expect(student.mustPayImmediately).toBe(false);
    });
});
