import { Factory, C, deferred } from '../../helpers';
import ErrorMonitor from '../../../src/components/error-monitoring';
import Dialog from '../../../src/components/tutor-dialog';
import { AppStore } from '../../../src/flux/app';

jest.mock('../../../src/components/tutor-dialog', () => ({
  hide: jest.fn(),
  show: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../../src/flux/app', () =>({
  AppStore: {
    on(_, cb) { this.cb = cb; },
    off: jest.fn(),
    getError() { return this.error; },
  },
}));

describe('Error monitoring: handlers', () => {
  let props;

  beforeEach(() => {
    props = {
      history: { push: jest.fn() },
      courseContext: {
        course: Factory.course(),
      },
    };
  });

  it('displays error dialog', () => {
    const em = mount(<C><ErrorMonitor {...props} /></C>);
    return deferred(() => {

      AppStore.error = { data: { errors: [ { code: 'no_exercises' } ] } };
      AppStore.cb();
      em.unmount();
      expect(Dialog.show).toHaveBeenCalledWith(expect.objectContaining({
        title: 'No exercises are available',
      }));
      expect(AppStore.off).toHaveBeenCalled();
    });
  });
});
