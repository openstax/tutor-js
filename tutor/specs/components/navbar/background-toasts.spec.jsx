import Toasts from '../../../src/components/navbar/background-toasts';
import EnzyeContext from '../helpers/enzyme-context';
import { SnapShot, Wrapper } from '../helpers/component-testing';
import  { JobCompletion, Completed } from '../../../src/models/jobs/queue';
jest.useFakeTimers();

describe('Background job toasts', () => {
  let toast;
  let job;

  beforeEach(() => {
    toast = mount(<Toasts />, EnzyeContext.build());
  });

  afterEach(() => Completed.clear());

  it('renders empty and matches snapshot', () => {
    expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
  });

  describe('scores', () => {

    beforeEach(() => {
      job = new JobCompletion({
        succeeded: true,
        type: 'scores',
      });
      Completed.push(job);
    });

    it('renders success', () => {
      expect(toast).toHaveRendered('Success');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      jest.runAllTimers();
      expect(toast).not.toHaveRendered('Success');
    });

    it('renders failure', () => {
      job.succeeded = false;
      expect(toast).toHaveRendered('Failure');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      toast.find('[type="close"]').simulate('click');
      expect(toast).not.toHaveRendered('Failure');
    });

    it('renders failure modal', () => {
      job.succeeded = false;
      toast.find('button').simulate('click');
      expect(toast).toHaveRendered('WarningModal');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
    });

  });

  describe('lms', () => {

    beforeEach(() => {
      job = new JobCompletion({
        succeeded: true,
        type: 'lms',
        info: {
          data: {
            num_callbacks: 123,
          },
        },
      });
      Completed.push(job);
    });

    it('renders success', () => {
      expect(toast).toHaveRendered('Success');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      jest.runAllTimers();
      expect(toast).not.toHaveRendered('Success');
    });

    it('renders failure', () => {
      job.succeeded = false;
      expect(toast).toHaveRendered('Failure');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
      toast.find('[type="close"]').simulate('click');
      expect(toast).not.toHaveRendered('Failure');
    });

    it('renders failure modal', () => {
      job.succeeded = false;
      toast.find('button').simulate('click');
      expect(toast).toHaveRendered('WarningModal');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
    });

    it('renders no scores failure modal', () => {
      job.info.data.num_callbacks = 0;
      job.succeeded = false;
      toast.find('button').simulate('click');
      expect(toast).toHaveRendered('WarningModal');
      expect(SnapShot.create(<Toasts />).toJSON()).toMatchSnapshot();
    });

  });

});
