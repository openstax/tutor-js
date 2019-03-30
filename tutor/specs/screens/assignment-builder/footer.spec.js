import { Factory } from '../../helpers';
import moment from 'moment';

import { TaskPlanActions } from '../../../src/flux/task-plan';
import { TimeStore } from '../../../src/flux/time';

import PlanFooter from '../../../src/screens/assignment-builder/footer';
import { ExtendBasePlan, PlanRenderHelper } from './task-plan-helper';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

jest.mock('../../../src/models/courses-map', () => ({
  get: jest.fn(() => ({ appearance_code: 'college_physics' }) ),
  teaching: { any: false },
  active: { isEmpty: false, teaching: { any: false, nonPreview: { any: false } } },
}));

const twoDaysBefore = moment(TimeStore.getNow()).subtract(2, 'days').format(ISO_DATE_FORMAT);
const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(ISO_DATE_FORMAT);

const NEW_READING = ExtendBasePlan({ type: 'reading', id: '_CREATING_1' });
const UNPUBLISHED_READING = ExtendBasePlan({ type: 'reading', is_published: false, is_publishing: false });
const PUBLISHED_READING = ExtendBasePlan({ type: 'reading', published_at: yesterday, is_published: true, is_publishing: false });
const PAST_DUE_PUBLISHED_READING = ExtendBasePlan(
  { type: 'reading', published_at: twoDaysBefore, is_published: true, is_publishing: false },
  { opens_at: twoDaysBefore, due_at: yesterday }
);
const VISIBLE_READING = ExtendBasePlan(
  { type: 'reading', is_published: true, is_publishing: false, published_at: yesterday },
  { opens_at: yesterday }
);
const VISIBLE_HW = ExtendBasePlan(
  { type: 'homework', is_published: true, is_publishing: false, published_at: yesterday },
  { opens_at: yesterday }
);

const NEW_HW = ExtendBasePlan({ type: 'homework', id: '_CREATING_1' });
const HW_WITH_EXERCISES = ({
  type: 'homework',
  is_published: true, is_publishing: false,
  settings: {
    exercise_ids: ['1'],
  },
});


// Stub the function, TODO - bring in helper
const getBackToCalendarParams = () =>
  ({
    to: 'calendarByDate',
    params: {
      date: moment(TimeStore.getNow()).format('YYYY-MM-DD'),
    },
  })
;


describe('Task Plan Footer', function() {
  let course;
  let helper;

  beforeEach(() => {
    course = Factory.course();
    helper = model => PlanRenderHelper(model, PlanFooter,
      {
        courseId: course.id,
        getBackToCalendarParams,
        onCancel: jest.fn(),
        onPublish: jest.fn(),
        goBackToCalendar: jest.fn(),
        isValid: true,
        hasError: false,
        onSave: jest.fn(),
      }
    ) ;

    TaskPlanActions.reset();
  });

  it('should have correct buttons when reading is new', () => {
    const reading = helper(NEW_READING);
    //    console.log(reading.debug())
    expect(reading).not.toHaveRendered('DeleteTaskButton Button');
    expect(reading).toHaveRendered('SaveTaskButton');
    expect(reading.find('SaveTaskButton').text()).toEqual('Publish');
    expect(reading).toHaveRendered('HelpTooltip');
  });

});
