import Toasts from '../../../src/components/navbar/background-toasts';
import EnzyeContext from '../helpers/enzyme-context';
import { SnapShot, Wrapper } from '../helpers/component-testing';
import ToastsStore from '../../../src/models/toasts';

jest.useFakeTimers();

describe('Background job toasts', () => {
  let toast;

  beforeEach(() => {
    toast = mount(<Toasts />, EnzyeContext.build());
  });

  afterEach(() => ToastsStore.clear());

  it('renders empty and matches snapshot', () => {
    expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
  });

  describe('scores', () => {

    beforeEach(() => {
      ToastsStore.push(
        new Toast({
          status: 'ok',
          type: 'scores',
        })
      );
    });

    fit('renders success', () => {
      // expect(toast).toHaveRendered('Success');
      // expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      // jest.runAllTimers();
      // expect(toast).not.toHaveRendered('Success');
    });

    it('renders failure', () => {
      toast.status = 'failed';
      expect(toast).toHaveRendered('Failure');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      toast.find('[type="close"]').simulate('click');
      expect(toast).not.toHaveRendered('Failure');
    });

    it('renders failure modal', () => {
      toast.status = 'failed';
      toast.find('button').simulate('click');
      expect(toast).toHaveRendered('WarningModal');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
    });

  });

  describe('lms', () => {

    beforeEach(() => {
      ToastsStore.push({
        status: 'ok',
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
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      jest.runAllTimers();
      expect(toast).not.toHaveRendered('Success');
    });

    it('renders failure', () => {
      toast.status = 'failed';
      expect(toast).toHaveRendered('Failure');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      toast.find('[type="close"]').simulate('click');
      expect(toast).not.toHaveRendered('Failure');
    });

    it('renders failure modal', () => {
      toast.status = 'failed';
      toast.find('button').simulate('click');
      expect(toast).toHaveRendered('WarningModal');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
    });

    it('renders no scores failure modal', () => {
      toast.info.data.num_callbacks = 0;
      toast.status = 'failed';
      toast.find('button').simulate('click');
      expect(toast).toHaveRendered('WarningModal');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
    });

  });

});
