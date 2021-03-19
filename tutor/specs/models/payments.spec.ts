import { bootstrapCoursesList } from '../courses-test-data';
import Payments from '../../src/models/payments';

describe('Course Student', () => {
    let course;
    let windowImpl;
    let createIframeImpl;

    beforeEach(() => {
        Payments.config.js_url = 'http://test.test.com/test.js';
        course = bootstrapCoursesList().get('1');
        createIframeImpl = () => Promise.resolve();
        class OSPaymentStub {
            constructor(options) {
                this.options = options;
                this.createIframe = jest.fn(createIframeImpl);
            }
        }
        windowImpl = { OSPayments: OSPaymentStub };
    });

    it('fetches when mounted', () => {
        const pay = new Payments({ course, windowImpl });
        pay.element = document.createElement('div');
        expect(pay.remote.createIframe).toHaveBeenCalled();
    });

    it('sets options on remote', () => {
        const pay = new Payments({ course, windowImpl });
        pay.element = document.createElement('div');
        expect(pay.remote.options).toMatchObject({
            course_uuid: course.uuid,
            product_instance_uuid: course.userStudentRecord.uuid,
            registration_date: course.primaryRole.joined_at,
        });
    });

    it('calls timeout when something breaks', () => {
        const thenSpy = jest.fn();
        createIframeImpl = () => ({ then: thenSpy });

        const pay = new Payments({ course, windowImpl, timeoutLength: 2 });
        pay.element = document.createElement('div');
        pay.logFailure = jest.fn();
        expect(pay.remote.createIframe).toHaveBeenCalled();
        expect(pay.pendingTimeout).not.toBeNull();
        expect(pay.errorMessage).toEqual('');

        return new Promise((done) => {
            setTimeout(() => {
                done();
            }, 20);
        }).then(() => {
            expect(thenSpy).toHaveBeenCalled();
            expect(pay.errorMessage).not.toEqual('');
            expect(pay.logFailure).toHaveBeenCalledWith('Payments load timed out');
        });
    });

});
