let React, ReactTestUtils, sinon, Testing;
import ld from 'underscore';
import moment from 'moment-timezone';

import { TaskPlanActions, TaskPlanStore } from '../../../src/flux/task-plan';
import { TaskingActions } from '../../../src/flux/tasking';
import Courses from '../../../src/models/courses-map';
import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';

import { ExternalPlan } from '../../../src/components/task-plan/external';

(((((((({ Testing, sinon, _, React, ReactTestUtils } = require('helpers')))))))));
import { ExtendBasePlan, PlanRenderHelper } from '../helpers/task-plan';

const yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);
const tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT);

const COURSE_ID = '1';
const COURSE = require('../../../api/user/courses/1.json');
const COURSE_ECOSYSTEM_ID = COURSE.ecosystem_id;

const VISIBLE_EXTERNAL = ExtendBasePlan({ type: 'external', is_published: true, exercise_ids: [1] },
  { opens_at: yesterday, due_at: tomorrow, target_id: COURSE.periods[0].id });
const UNPUBLISHED_EXTERNAL = ExtendBasePlan({ type: 'external' });
const NEW_EXTERNAL = ExtendBasePlan({ type: 'external', id: '_CREATING_1' });

const helper = model => PlanRenderHelper(model, ExternalPlan);

describe('External Homework Plan', function() {
  beforeEach(function() {
    Courses.bootstrap([COURSE], { clear: true });
    TaskPlanActions.reset();
    return TaskingActions.reset();
  });

  it('should allow set url when not visible', () =>
    helper(UNPUBLISHED_EXTERNAL).then(({ dom }) =>
      expect(
        dom.querySelector('#external-url').getAttribute('disabled')
      ).not.to.exist
    )
  );

  xit('should not allow add setting url after visible', () =>
    helper(VISIBLE_EXTERNAL).then(({ dom, element }) =>
      expect(
        dom.querySelector('#external-url').getAttribute('disabled')
      ).to.exist
    )
  );

  xit('should show url required message when saving and no assignment URL', () =>
    helper(NEW_EXTERNAL).then(function({ dom }) {
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.external-url.is-required.has-error')).to.not.be.null;
    })
  );

  return it('can mark form as invalid', () =>
    helper(NEW_EXTERNAL).then(function({ dom }) {
      expect(dom.querySelector('.edit-external.is-invalid-form')).to.be.null;
      Testing.actions.click(dom.querySelector('.-save'));
      return expect(dom.querySelector('.edit-external.is-invalid-form')).to.not.be.null;
    })
  );
});
