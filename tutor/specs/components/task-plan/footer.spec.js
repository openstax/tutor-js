import { Testing, sinon, _, React } from '../helpers/component-testing';
import moment from 'moment';

import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';
import { TimeActions, TimeStore } from '../../../src/flux/time';

import PlanFooter from '../../../src/components/task-plan/footer';
import { ExtendBasePlan, PlanRenderHelper } from '../helpers/task-plan';

const ISO_DATE_FORMAT = 'YYYY-MM-DD';

jest.mock('../../../src/models/courses-map', () => ({
  get: jest.fn(() => ({ appearance_code: 'college_physics' }) ),
}));

const twoDaysBefore = moment(TimeStore.getNow()).subtract(2, 'days').format(ISO_DATE_FORMAT);
const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(ISO_DATE_FORMAT);
const tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(ISO_DATE_FORMAT);
const dayAfter = moment(TimeStore.getNow()).add(2, 'day').format(ISO_DATE_FORMAT);

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


const helper = model => PlanRenderHelper(model, PlanFooter,
  {
    getBackToCalendarParams,
    onCancel: sinon.spy(),
    onPublish: sinon.spy(),
    goBackToCalendar: sinon.spy(),
    isValid: true,
    hasError: false,
    onSave: sinon.spy(),
  }
) ;

describe('Task Plan Footer', function() {
  beforeEach(() => TaskPlanActions.reset());

  fit('should have correct buttons when reading is new', () =>
    helper(NEW_READING).then(function({ dom }) {
      expect(dom.querySelector('.delete-link')).to.be.null;
      expect(dom.querySelector('.preview-btn')).to.not.be.null;
      expect(dom.querySelector('.-save')).to.not.be.null;
      expect(dom.querySelector('.-publish')).to.not.be.null;
      expect(dom.querySelector('.-publish').textContent).to.equal('Publish');
    })
  );

  it('should have correct buttons when reading is unpublished', () =>
    helper(UNPUBLISHED_READING).then(function({ dom }) {
      expect(dom.querySelector('.delete-link')).to.not.be.null;
      expect(dom.querySelector('.-save')).to.not.be.null;
      expect(dom.querySelector('.-publish')).to.not.be.null;
    })
  );

  it('should have correct buttons when reading is published', () =>
    helper(PUBLISHED_READING).then(function({ dom }) {
      expect(dom.querySelector('.delete-link')).to.not.be.null;
      expect(dom.querySelector('.-save')).to.be.null;
      expect(dom.querySelector('.-publish')).to.not.be.null;
      expect(dom.querySelector('.-publish').textContent).to.equal('Save');
    })
  );

  it('should have correct buttons when reading is visible', () =>
    helper(VISIBLE_READING).then(function({ dom }) {
      expect(dom.querySelector('.delete-link')).to.not.be.null;
      expect(dom.querySelector('.-save')).to.be.null;
      expect(dom.querySelector('.-publish')).to.not.be.null;
    })
  );

  it('should have correct buttons when reading is past due', () =>
    helper(PAST_DUE_PUBLISHED_READING).then(function({ dom }) {
      expect(dom.querySelector('.delete-link')).to.not.be.null;
      expect(dom.querySelector('.-save')).to.be.null;
      expect(dom.querySelector('.-publish')).to.not.be.null;
    })
  );

  it('should have help tooltip', () =>
    helper(PUBLISHED_READING).then(({ dom }) => expect(dom.querySelector('.footer-instructions')).to.not.be.null)
  );
});
