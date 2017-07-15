import { assign } from 'lodash';
import Student from '../../../src/models/course/student';

jest.mock('../../../src/flux/time', () => ({
  TimeStore: {
    getNow: jest.fn(() => new Date('2000-01-01')),
  },
}));

describe('Course Student', () => {

  test('#needsPayment', () => {
    const student = new Student({ prompt_student_to_pay: false });
    expect(student.needsPayment).toBe(false);
    assign(student, { prompt_student_to_pay: true });
    expect(student.needsPayment).toBe(true);
  });


  test('#mustPayImmediately', () => {
    const student = new Student({ payment_due_at: '1999-12-30', prompt_student_to_pay: true });
    expect(student.needsPayment).toBe(true);
    expect(student.mustPayImmediately).toBe(true);
    student.payment_due_at = new Date('2000-01-02');
    expect(student.needsPayment).toBe(true);
    expect(student.mustPayImmediately).toBe(false);
  });
});
