import Toasts from 'shared/components/toasts';
import '../../../src/components/toasts'
import { currentToasts } from '../../../src/models';
import { action, runInAction } from '../../helpers';

jest.useFakeTimers();

describe('Background job toasts', () => {

    it('renders empty and matches snapshot', () => {
        expect.snapshot(<Toasts />).toMatchSnapshot();
    });

    describe('scores', () => {
        let toast;

        beforeEach(action(() => {
            toast = mount(<Toasts toasts={currentToasts} />);
            currentToasts.clear()
            currentToasts.add({
                handler: 'job',
                type: 'scores',
                status: 'ok',
                info: { url: 'test.test.com' },
            })
        }));


        it('renders success', () => {
            expect(toast).toHaveRendered('Success');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            jest.runAllTimers();
            expect(toast).not.toHaveRendered('Success');
        });

        it('renders failure', () => {
            runInAction(() => {
                toast.instance().currentToast.status = 'failed';
            })
            toast.update();
            expect(toast).toHaveRendered('Failure');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            toast.find('button.dismiss').simulate('click');
            expect(toast).not.toHaveRendered('Failure');
        });

        it('renders failure modal', () => {
            runInAction(() => {
                toast.instance().currentToast.status = 'failed';
            })
            toast.update();
            toast.find('button.details').simulate('click');
            expect(toast).toHaveRendered('WarningModal');
            expect.snapshot(<Toasts />).toMatchSnapshot();
        });

    });

    describe('lms', () => {
        let toast;

        beforeEach(action(() => {
            toast = mount(<Toasts toasts={currentToasts} />);
            currentToasts.clear()
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
        }));

        it('renders success', () => {
            expect(toast).toHaveRendered('Success');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            jest.runAllTimers();
            expect(toast).not.toHaveRendered('Success');
        });

        it('renders failure', () => {
            runInAction(() => {
                toast.instance().currentToast.status = 'failed';
            })
            toast.update();
            expect(toast).toHaveRendered('Failure');
            expect.snapshot(<Toasts />).toMatchSnapshot();
            toast.find('button.dismiss').simulate('click');
            expect(toast).not.toHaveRendered('Failure');
        });

        it('renders failure modal', () => {
            runInAction(() => {
                toast.instance().currentToast.status = 'failed';
            })
            toast.update();
            toast.find('button.details').simulate('click');
            expect(toast).toHaveRendered('WarningModal');
            expect.snapshot(<Toasts />).toMatchSnapshot();
        });

        it('renders no scores failure modal', () => {
            const t = toast.instance().currentToast;
            runInAction(() => {
                t.info.data.num_callbacks = 0;
                t.status = 'failed';
            })
            toast.update();
            toast.find('button.details').simulate('click');
            expect(toast).toHaveRendered('WarningModal');
            expect.snapshot(<Toasts />).toMatchSnapshot();
        });

    });

});
