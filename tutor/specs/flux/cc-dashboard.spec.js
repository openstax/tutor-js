import { expect } from 'chai';

import ld from 'underscore';
import ld from 'lodash';

const COURSE_ID = '4'; // CC course
const PERIOD_ID = '4';
import COURSE from '../../api/courses/4/dashboard';

import { CCDashboardActions, CCDashboardStore } from '../../src/flux/cc-dashboard';

describe('CC Dashboard Store', function() {

  beforeEach(function(done) {
    CCDashboardActions.loaded(COURSE, COURSE_ID);
    return _.defer(done);
  }); // defer done signal so it fires after exercise load emits

  it('returns chapters that can be displayed', function() {
    const chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, PERIOD_ID);
    expect(_.pluck(chapters, 'id') ).toEqual(['39', '40']);
    return undefined;
  });

  return it('calculates completion on returned chapters', function() {
    const chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, PERIOD_ID);
    const percents = _.pluck( _.flatten( _.pluck(chapters, 'pages') ), 'completed_percentage');
    expect(percents).toEqual([0.4, 0.8, 0.8, 0.8]);
    return undefined;
  });
});
