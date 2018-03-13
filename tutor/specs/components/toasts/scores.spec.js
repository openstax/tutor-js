import { Success, Failure } from '../../../src/components/toasts/scores';
import EnzyeContext from '../helpers/enzyme-context';
import { SnapShot, Wrapper } from '../helpers/component-testing';
import { portalContents as PC } from '../../helpers/portals';

import { ToastModel } from '../../../src/models/toasts';
jest.useFakeTimers();

describe('Scores Background job toasts', () => {

  let props;

  beforeEach(() => {
    const toast = new ToastModel({
      succeeded: true,
      handler: 'job',
      type: 'scores',
      info: { },
    });

    props = { toast, dismiss: jest.fn, footer: <span /> };
  });

  it('renders success', () => {
    let toast = shallow(<Success {...props} />, EnzyeContext.build());
    expect(toast.text()).toContain('successfully exported');
  });

  it('renders failure', ()=> {
    let toast = shallow(<Failure {...props} />, EnzyeContext.build());
    expect(toast.text()).toContain('not exported');
  });

});
