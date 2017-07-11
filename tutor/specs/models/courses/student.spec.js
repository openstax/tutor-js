import { assign } from 'lodash';
import Student from '../../../src/models/course/student';

jest.mock('../../../src/flux/time', () => ({
  TimeStore: {
    getNow: jest.fn(() => new Date('2000-01-01')),
  },
}));

describe('Course Student', () => {

  test('#needsPayment', () => {
    const student = new Student({ is_paid: true });
    expect(student.needsPayment).toBe(false);
    assign(student, { is_paid: false, is_comped: true });
    expect(student.needsPayment).toBe(false);
    student.is_comped = false;
    expect(student.needsPayment).toBe(true);
    student.markPaid();
    expect(student.needsPayment).toBe(false);
  });

  test('#mustPayImmediatly', () => {
    const student = new Student({ payment_due_at: '1999-12-30' });
    expect(student.needsPayment).toBe(true);
    expect(student.mustPayImmediatly).toBe(true);
    student.payment_due_at = new Date('2000-01-02');
    expect(student.needsPayment).toBe(true);
    expect(student.mustPayImmediatly).toBe(false);
  });
});
