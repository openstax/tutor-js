import { TEACHER_COURSE_TWO_MODEL } from '../../../courses-test-data';

import CourseUX from '../../../../src/models/course/onboarding/full-course';
import UiSettings from 'shared/src/model/ui-settings';
import User from '../../../../src/models/user';
import moment from 'moment';
jest.mock('shared/src/model/ui-settings');
jest.mock('../../../../src/models/user', ()=> ({
  logEvent: jest.fn(),
}));

describe('Full Course Onboarding', () => {
  let ux;

  beforeEach(() => {
    UiSettings.get.mockImplementation(() => undefined);
    ux = new CourseUX(
      { id: 1, isActive: true, primaryRole: { joined_at: new Date() } },
      { tour: null },
    );
  });

  it('#nagComponent', () => {
    expect(ux.nagComponent).toBeNull();
    ux.course.primaryRole.joined_at = moment().subtract(4, 'hours').subtract(1, 'second');

    expect(ux.nagComponent).not.toBeNull();

    UiSettings.get.mockImplementation(() => 'dn');
    ux.course.primaryRole.joined_at = moment().subtract(2, 'hours');

    expect(ux.nagComponent).toBeNull();

    ux.responce = 'dn';
    expect(ux.nagComponent).toBeNull();
    ux.course.primaryRole.joined_at = moment().subtract(4, 'hours').subtract(1, 'second');
    expect(ux.nagComponent).not.toBeNull();

    UiSettings.get.mockImplementation(() => 'wu');
    expect(ux.nagComponent).toBeNull();
  });

  it('#recordExpectedUse(decision)', () => {
    ux.recordExpectedUse('wu');
    expect(User.logEvent).toHaveBeenCalledWith({
      category: 'onboarding', code: 'made_adoption_decision',
      data: { decision: 'I wont be using it' },
    });
    expect(UiSettings.set).toHaveBeenCalledWith('OBC', 1, 'wu');
  });

  it('hides itself if tour is being displayed', () => {
    ux.course.primaryRole.joined_at = moment().subtract(4, 'hours').subtract(1, 'second');
    ux.tourContext.tour = true;
    expect(ux.nagComponent).toBeNull();
    ux.tourContext.tour = null;
    expect(ux.nagComponent).not.toBeNull();
    User.terms_signatures_needed = true;
    expect(ux.nagComponent).toBeNull();
  });
});
