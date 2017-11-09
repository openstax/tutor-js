import { Success, LMSErrors, Failure } from '../../../../src/components/navbar/toasts/lms';
import EnzyeContext from '../../helpers/enzyme-context';
import { SnapShot, Wrapper } from '../../helpers/component-testing';
import { portalContents as PC } from '../../../helpers/portals';

import  { JobCompletion, Completed } from '../../../../src/models/jobs/queue';
jest.useFakeTimers();

describe('Background job toasts', () => {
  let toast;
  let job;
  let props;

  beforeEach(() => {

    job = new JobCompletion({
      succeeded: true,
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
    props = { job, dismiss: jest.fn, footer: <span /> };
    Completed.push(job);
  });

  afterEach(() => Completed.clear());

  it('pluralizes error count', () => {
    toast = mount(<LMSErrors {...props} />, EnzyeContext.build());
    expect(PC(toast).textContent).toContain(
      'Course averages for 1 student could not be sent'
    );
    job.info.errors.push({
      student_identifier: '4321', student_name: 'Jane', score: 0.923,
    });
    toast = mount(<LMSErrors {...props} />, EnzyeContext.build());
    expect(PC(toast).textContent).toContain(
      'Course averages for 2 students could not be sent'
    );
    expect(PC(toast).innerHTML).toMatchSnapshot();
  });

  it('toggles error list', () => {
    toast = mount(<LMSErrors {...props} />, EnzyeContext.build());
    expect(
      PC(toast).querySelector('.btn.toggle').textContent
    ).toContain('Show');
    PC(toast).querySelector('.btn.toggle').click();
    const body = PC(toast);
    expect(
      body.querySelector('.btn.toggle').textContent
    ).toContain('Hide');
    expect(body.querySelector('tbody').textContent).toContain(
      'Bob'
    );
    expect(body.querySelector('tbody').textContent).toContain(
      '12.3'
    );
    expect(PC(toast).innerHTML).toMatchSnapshot();
  });

});
