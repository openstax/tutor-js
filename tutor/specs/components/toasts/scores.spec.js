import { Success, Failure } from '../../../src/components/toasts/scores';
import { C } from '../../helpers';

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
    let toast = mount(<C><Success {...props} /></C>);
    expect(toast.text()).toContain('successfully exported');
  });

  it('renders failure', ()=> {
    let toast = mount(<C><Failure {...props} /></C>);
    expect(toast.text()).toContain('not exported');
  });

});
