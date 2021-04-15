import { delay, Factory, runInAction } from '../helpers'
import { User } from '../../src/models'
import { Payments } from '../../src/helpers/payments'

describe('Course Student Payments', () => {
    let course: ReturnType<typeof Factory.course>;
    let windowImpl: any;
    let createIframeImpl: any;
    let user: User

    beforeEach(() => {
        Payments.config.js_url = 'http://test.test.com/test.js';
        course = Factory.course({ id: '1' })
        user = new User()
        createIframeImpl = () => Promise.resolve();
        class OSPaymentStub {
            options: any
            createIframe: () => void
            constructor(options: any) {
                this.options = options;
                this.createIframe = jest.fn(createIframeImpl);
            }
        }
        windowImpl = { OSPayments: OSPaymentStub };
    });

    it('fetches when mounted', () => {
        const pay = new Payments({ user, course, windowImpl });
        runInAction(() => pay.element = document.createElement('div') )
        expect(pay.remote.createIframe).toHaveBeenCalled();
    });

    it('sets options on remote', () => {
        const pay = new Payments({ user, course, windowImpl });
        runInAction(() => pay.element = document.createElement('div') )
        expect(pay.remote.options).toMatchObject({
            course_uuid: course.uuid,
            product_instance_uuid: course.userStudentRecord?.uuid,
            registration_date: course.primaryRole.joined_at,
        });
    });

    it('calls timeout when something breaks', async () => {
        const thenSpy = jest.fn();
        createIframeImpl = () => ({ then: thenSpy });

        const pay = new Payments({ user, course, windowImpl, timeoutLength: 2 })
        runInAction(() => pay.element = document.createElement('div') )
        pay.logFailure = jest.fn();
        expect(pay.remote.createIframe).toHaveBeenCalled();
        expect(pay.pendingTimeout).not.toBeNull();
        expect(pay.errorMessage).toBeUndefined()

        await delay(20)

        expect(thenSpy).toHaveBeenCalled();
        expect(pay.errorMessage).not.toEqual('');
        expect(pay.logFailure).toHaveBeenCalledWith('Payments load timed out');

    });

});
