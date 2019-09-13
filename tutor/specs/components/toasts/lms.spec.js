import { LMSErrors } from '../../../src/components/toasts/lms';
import { getPortalNode as PC } from '../../helpers';

import { Toast } from 'shared/model/toasts';
jest.useFakeTimers();

describe('LMS Background job toasts', () => {

  let toast;
  let props;

  beforeEach(() => {
    const toast = new Toast({
      succeeded: true,
      handler: 'job',
      type: 'lms',
      info: {
        errors: [
          { student_identifier: '1234', student_name: 'Bob', score: 0.123 },
        ],
        data: {
          num_callbacks: 0,
        },
      },
    });

    props = { toast, dismiss: jest.fn, footer: <span /> };
  });

  it('pluralizes error count', () => {
    let toast = mount(<LMSErrors {...props} />);
    expect(PC(toast).textContent).toContain(
      'Course averages for 1 student could not be sent'
    );
    toast.props().toast.info.errors.push({
      student_identifier: '4321', student_name: 'Jane', score: 0.923,
    });
    toast = mount(<LMSErrors {...props} />);
    expect(PC(toast).textContent).toContain(
      'Course averages for 2 students could not be sent'
    );
    expect(PC(toast).innerHTML).toMatchSnapshot();
  });

  it('toggles error list', () => {
    toast = mount(<LMSErrors {...props} />);
    expect(
      PC(toast).textContent
    ).toContain('There may be an issue');
    PC(toast).querySelector('.btn-primary').click();
    const body = PC(toast);
    expect(
      body.textContent
    ).toContain('SCORES NOT SENT');
    expect(body.querySelector('tbody').textContent).toContain(
      'Bob'
    );
    expect(body.querySelector('tbody').textContent).toContain(
      '12%'
    );
    expect(PC(toast).innerHTML).toMatchSnapshot();
  });

});
