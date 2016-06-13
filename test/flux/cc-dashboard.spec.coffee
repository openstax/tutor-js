{expect} = require 'chai'

_ = require 'underscore'
ld = require 'lodash'

COURSE_ID = '4' # CC course
PERIOD_ID = '4'
COURSE = require '../../api/courses/4/dashboard'

{CCDashboardActions, CCDashboardStore} = require '../../src/flux/cc-dashboard'

describe 'CC Dashboard Store', ->

  beforeEach (done) ->
    CCDashboardActions.loaded(COURSE, COURSE_ID)
    _.defer(done) # defer done signal so it fires after exercise load emits

  it 'returns chapters that can be displayed', ->
    chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, PERIOD_ID)
    expect(_.pluck(chapters, 'id') ).to.deep.equal(['39', '40'])

  it 'calculates completion on returned chapters', ->
    chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, PERIOD_ID)
    percents = _.pluck( _.flatten( _.pluck(chapters, 'pages') ), 'completed_percentage')
    expect(percents).to.deep.equal([0.4, 0.8, 0.8, 0.8])
