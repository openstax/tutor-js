{expect} = require 'chai'
_ = require 'underscore'

{Promise} = require 'es6-promise'
React = require 'react/addons'

{componentStub, commonActions}   = require './helpers/utilities'

{CoursePeriodsNav} = require '../../src/components/course-periods-nav'
{CourseActions, CourseStore} = require '../../src/flux/course'
COURSE = require '../../api/user/courses/1.json'
COURSE_PERIODS = COURSE.periods
COURSE_ID = '1'

describe 'Course Periods Navigation', ->
  # Don't need to render on each since no actions are being performed between each task
  beforeEach (done) ->
    CourseActions.loaded(COURSE, COURSE_ID)

    handleSelect = (period) =>
      @selectedPeriod = period

    componentStub
      .render(<CoursePeriodsNav courseId={COURSE_ID} handleSelect={handleSelect}/>)
      .then((result) =>
        @result = result

        done()
      , done)

  afterEach ->
    componentStub.unmount()
    CourseActions.reset()

  it 'should render periods with period names', (done) ->
    {div} = @result

    periodItems = div.querySelectorAll('li')
    expect(periodItems.length).to.equal(COURSE_PERIODS.length)

    periodRenderedNames = _.pluck(periodItems, 'textContent')
    periodNames = _.pluck(COURSE_PERIODS, 'name')

    expect(periodRenderedNames).to.deep.equal(periodNames)

    done()

  it 'should pass in period info when selected', (done) ->
    {div} = @result

    firstPeriodItemLink = div.querySelector('li > a')
    commonActions.click(firstPeriodItemLink)

    expect(@selectedPeriod).to.deep.equal(COURSE_PERIODS[0])

    done()
