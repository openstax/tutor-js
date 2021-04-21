import Toasts from 'shared/components/toasts';
import { currentToasts } from '../../../src/models';
import { runInAction } from '../../helpers';

jest.useFakeTimers();

describe('Background job toasts', () => {
    let toast;

    beforeEach(() => {
        toast = mount(<Toasts toasts={currentToasts} />);
    });

    it('renders empty and matches snapshot', () => {
        expect.snapshot(<Toasts />).toMatchSnapshot();
    });

    describe('scores', () => {

        beforeEach(() => {
            runInAction(() =>
                currentToasts.add({
                    handler: 'job',
                    type: 'scores',
                    status: 'ok',
                    info: { url: 'test.test.com' },
                })
            )
        });

        it('renders success', () => {
            expect(toast).toHaveRendered('Success');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            jest.runAllTimers();
            expect(toast).not.toHaveRendered('Success');
        });

        it('renders failure', () => {
            toast.instance().currentToast.status = 'failed';
            toast.update();
            expect(toast).toHaveRendered('Failure');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            toast.find('button.dismiss').simulate('click');
            expect(toast).not.toHaveRendered('Failure');
        });

        it('renders failure modal', () => {
            toast.instance().currentToast.status = 'failed';
            toast.update();
            toast.find('button.details').simulate('click');
            expect(toast).toHaveRendered('WarningModal');
            expect.snapshot(<Toasts />).toMatchSnapshot();
        });

    });

    describe('lms', () => {

        beforeEach(() => {
            currentToasts.add({
                status: 'ok',
                handler: 'job',
                type: 'lms',
                info: {
                    data: {
                        num_callbacks: 123,
                    },
                },
            });
        });

        it('renders success', () => {
            expect(toast).toHaveRendered('Success');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            jest.runAllTimers();
            expect(toast).not.toHaveRendered('Success');
        });

        it('renders failure', () => {
            toast.instance().currentToast.status = 'failed';
            toast.update();
            expect(toast).toHaveRendered('Failure');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            toast.find('button.dismiss').simulate('click');
            expect(toast).not.toHaveRendered('Failure');
        });

        it('renders failure modal', () => {
            toast.instance().currentToast.status = 'failed';
            toast.update();
            toast.find('button.details').simulate('click');
            expect(toast).toHaveRendered('WarningModal');
            expect.snapshot(<Toasts />).toMatchSnapshot();
        });

        it('renders no scores failure modal', () => {
            const t = toast.instance().currentToast;
            t.info.data.num_callbacks = 0;
            t.status = 'failed';
            toast.update();
            toast.find('button.details').simulate('click');
            expect(toast).toHaveRendered('WarningModal');
            expect.snapshot(<Toasts />).toMatchSnapshot();
        });

    });

});
