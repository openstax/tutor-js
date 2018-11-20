import { TEACHER_COURSE_TWO_MODEL } from '../../../courses-test-data';
import { Factory, TimeMock } from '../../../helpers';
import CourseUX from '../../../../src/models/course/onboarding/full-course';
import UiSettings from 'shared/model/ui-settings';
import User from '../../../../src/models/user';
import moment from 'moment';
import Time from '../../../../src/models/time';
import Nags from '../../../../src/components/onboarding/nags';

jest.mock('shared/model/ui-settings', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

// jest.mock('../../../../src/flux/time', () => ({
//   TimeStore: {
//     getNow: jest.fn(() => new Date('Thu Aug 31 2017 16:53:12 GMT-0500 (CDT)')),
//   },
// }));

jest.mock('../../../../src/models/user', ()=> ({
  logEvent: jest.fn(),
}));

describe('Full Course Onboarding', () => {
  let ux;

  const now = new Date('Thu Aug 31 2017 16:53:12 GMT-0500 (CDT)');
  TimeMock.setTo(now);

  beforeEach(() => {
    UiSettings.get.mockImplementation(() => undefined);
    ux = new CourseUX(
      {
        id: 1, isActive: true, primaryRole: {
          joined_at: moment(Time.now).subtract(4, 'hours').subtract(1, 'second').toDate(),
        },
      },
      { tour: null },
    );
  });

  it('#nagComponent', () => {
    expect(ux.nagComponent).not.toBeNull();
    UiSettings.get.mockImplementation(() => 'dn');
    ux.course.primaryRole.joined_at = moment(ux.course.primaryRole.joined_at).add(2, 'hours');
    expect(ux.courseIsNaggable).toBe(false);
    expect(ux.nagComponent).toBeNull();
    ux.recordExpectedUse('dn');
    expect(ux.nagComponent).not.toBeNull();
    ux.course.primaryRole.joined_at = moment(ux.course.primaryRole.joined_at).add(4, 'hours');
    ux.response = false;
    expect(ux.nagComponent).toBeNull();
  });

  it('#recordExpectedUse(decision)', () => {
    ux.recordExpectedUse('cc');
    expect(User.logEvent).toHaveBeenCalledWith({
      category: 'onboarding', code: 'made_adoption_decision',
      data: { decision: 'For course credit', course_id: ux.course.id },
    });
    expect(UiSettings.set).toHaveBeenCalledWith('OBC', 1, 'cc');
  });

  it('hides itself if tour is being displayed', () => {
    ux.tourContext.tour = true;
    expect(ux.nagComponent).toBeNull();
    ux.tourContext.tour = null;
    expect(ux.nagComponent).not.toBeNull();
    User.terms_signatures_needed = true;
    expect(ux.nagComponent).toBeNull();
  });

  it('wont nag until after interval', () => {
    ux.recordExpectedUse('dn');
    ux.response = false;
    User.terms_signatures_needed = false;
    UiSettings.get.mockImplementation((id) => id == 'OBNT' ? 1504216390000 : 'dn');
    expect(UiSettings.set).toHaveBeenCalledWith('OBC', 1, 'dn');
    expect(UiSettings.set).toHaveBeenCalledWith('OBNT', 1, 1504216392000);

    expect(ux.lastNaggedAgo).toEqual(2000);
    expect(ux.isOnboardingUndecided).toBe(false);
    expect(ux.nagComponent).toBeNull();

    TimeMock.mock(new Date('Thu Sept 7 2017 16:53:12 GMT-0500 (CDT)'));

    expect(ux.lastNaggedAgo).toEqual(604802000);
    expect(ux.isOnboardingUndecided).toBe(true);
    expect(ux.nagComponent).toBe(Nags.freshlyCreatedCourse);
  });

});
