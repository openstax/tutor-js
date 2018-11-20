import { Success, Failure } from '../../../src/components/toasts/scores';
import { EnzymeContext, getPortalNode as PC } from '../../helpers';

import { Toast } from 'shared/model/toasts';
jest.useFakeTimers();

describe('Scores Background job toasts', () => {

  let props;

  beforeEach(() => {
    const toast = new Toast({
      succeeded: true,
      handler: 'job',
      type: 'scores',
      info: { },
    });

    props = { toast, dismiss: jest.fn, footer: <span /> };
  });

  it('renders success', () => {
    let toast = shallow(<Success {...props} />, EnzymeContext.build());
    expect(toast.text()).toContain('successfully exported');
  });

  it('renders failure', ()=> {
    let toast = shallow(<Failure {...props} />, EnzymeContext.build());
    expect(toast.text()).toContain('not exported');
  });

});
