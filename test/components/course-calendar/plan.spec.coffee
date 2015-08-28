# Some pretty sweet suite of tests for the plan component, but more important will be the tests
# around the parent Duration component, which may be re-written to a flux or as helpers
# before tests are made for that.

{Testing, sinon, expect, _, React} = require '../helpers/component-testing'

React = require 'react'
_ = require 'underscore'
moment = require 'moment'
twix = require 'twix'
camelCase = require 'camelcase'

{TimeActions, TimeStore} = require '../../../src/flux/time'
{PlanPublishStore, PlanPublishActions} = require '../../../src/flux/plan-publish'

Plan = require '../../../src/components/course-calendar/plan'

CALENDAR_DATE_FORMAT = 'YYYY-MM-DD'
PLAN_COURSE_ID = '100'

DURATION_ITEMS = require './plan-durations.fake.json'

ITEM_DRAFT_ONE_DAY = _.clone(DURATION_ITEMS[0])
ITEM_PUBLISHED_THREE_DAYS = _.clone(DURATION_ITEMS[1])
ITEM_PUBLISHED_TWO_DAYS = _.clone(DURATION_ITEMS[2])

REFERENCE_TEST_DATE = '2015-08-29T05:00:00.000Z'

RELATIVE_DIFF_DAYS = moment(TimeStore.getNow()).diff(REFERENCE_TEST_DATE, 'days')

TEST_ITEMS = [
  ITEM_DRAFT_ONE_DAY
  ITEM_PUBLISHED_THREE_DAYS
  ITEM_PUBLISHED_TWO_DAYS
]

JOB_UUID = 'this-is-a-fake-job-uuid'

_.each(TEST_ITEMS, (item) ->
  _.each(item.displays, (display) ->
    display.rangeDuration = moment(display.rangeDuration.start)
      .add(RELATIVE_DIFF_DAYS, 'days')
      .twix(moment(display.rangeDuration.end).add(RELATIVE_DIFF_DAYS, 'days'))
  )
)



fakePublishing = (plan) ->
  publishingPlan = _.clone(plan)
  publishingPlan.publish_last_requested_at = moment(TimeStore.getNow())
  publishingPlan.publish_job_uuid = JOB_UUID

  if publishingPlan.published_at and moment(publishingPlan.published_at).isAfter(publishingPlan.publish_last_requested_at)
    publishingPlan.published_at = moment(publishingPlan.publish_last_requested_at).subtract(2, 'days')

  publishingPlan

checkChildrenComponents = (planComponent, item, checks) ->

  {plan, displays} = item

  displaysComponents = _.map(displays, (display) ->
    displayComponent = planComponent.refs["display#{display.index}"]
    labelComponent = planComponent.refs["label#{display.index}"]
    components = {displayComponent, labelComponent}

    checks?.display?(components, {display})

    components
  )

  details = planComponent.refs.details
  checks?.details?({details}, {plan})

  {displaysComponents, detailsComponent: details}


calcPercentOfRangeLength = (durationLength) ->
  basePercent = (100 / 7 * durationLength).toFixed(4)

buildWidthString = (durationLength) ->
  basePercent = calcPercentOfRangeLength(durationLength)
  [
    "width:calc(#{basePercent}"
    "width:#{basePercent}"
  ]

isLeftApproximate = (durationLength, leftPercentString) ->
  basePercent = calcPercentOfRangeLength(durationLength)
  leftPercent = parseFloat(leftPercentString).toFixed(4)

  basePercent is leftPercent

checkHasEditLinkBeenRendered = (plan) ->
  linkTo = camelCase("edit-#{plan.type}")
  params = {id: plan.id, courseId: PLAN_COURSE_ID}

  expect(Testing.router.makeHref).to.have.been.calledWith(linkTo, params)

checkHasMatchingModalBeenRendered = (detailsComponent, displayNode, plan) ->
  fullModal = detailsComponent.getDOMNode()
  detailsModal = fullModal.querySelector('.plan-modal')

  expect(detailsComponent).to.not.be.undefined
  expect(fullModal.querySelector('.modal-backdrop')).to.be.an('object')
  # plan and modal should match
  displayClasses = displayNode.className.replace('plan ', '')
  expect(detailsModal.className).to.contain(displayClasses)

  {detailsModal, fullModal}

checkModalByClick = (element, item) ->
  {plan} = item
  {displaysComponents, detailsComponent} = checkChildrenComponents(element, item)

  expect(detailsComponent).to.not.exist

  {displayComponent} = _.first(displaysComponents)
  displayNode = displayComponent.getDOMNode()
  Testing.actions.click(displayNode)

  {detailsComponent} = checkChildrenComponents(element, item)
  {detailsModal, fullModal} = checkHasMatchingModalBeenRendered(detailsComponent, displayNode, plan)

  {detailsComponent, detailsModal, fullModal, displayComponent}


describe 'Plan on Course Calendar', ->

  afterEach ->
    PlanPublishActions.reset()

  it 'should render a properly positioned plan', ->
    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item: ITEM_DRAFT_ONE_DAY} )
      .then ({dom, element}) ->
        {plan} = ITEM_DRAFT_ONE_DAY
        widthStrings = buildWidthString(plan.durationLength)

        checks =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()
            labelNode = components.labelComponent.getDOMNode()

            expect(displayNode.innerText).to.equal(plan.title)
            expect(labelNode.innerText).to.equal(plan.title)
            expect(isLeftApproximate(display.offset, displayNode.style.left)).to.be.true

        checkChildrenComponents(element, ITEM_DRAFT_ONE_DAY, checks)
        expect(dom.innerText).to.equal(plan.title)
        expect(dom.innerHTML).to.contain(widthStrings[0])


  it 'should display as draft when plan is saved as draft', ->
    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item: ITEM_DRAFT_ONE_DAY} )
      .then ({dom, element}) ->
        checks =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()
            # classes should not contain either is-published or is-publishing
            expect(displayNode.className).to.not.contain('is-publish')

        checkChildrenComponents(element, ITEM_DRAFT_ONE_DAY, checks)


  it 'should make a link for drafts to edit route', ->
    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item: ITEM_DRAFT_ONE_DAY} )
      .then ({dom, element}) ->
        checkHasEditLinkBeenRendered(ITEM_DRAFT_ONE_DAY.plan)


  it 'should render a plan sized to the range', ->
    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item: ITEM_PUBLISHED_THREE_DAYS} )
      .then ({dom, element}) ->
        {plan} = ITEM_PUBLISHED_THREE_DAYS
        widthStrings = buildWidthString(plan.durationLength)

        checks =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()

            expect(isLeftApproximate(display.offset, displayNode.style.left)).to.be.true

        checkChildrenComponents(element, ITEM_PUBLISHED_THREE_DAYS, checks)
        expect(dom.innerHTML).to.contain(widthStrings[0])

  it 'should render a plan with the right type', ->
    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item: ITEM_PUBLISHED_THREE_DAYS} )
      .then ({dom, element}) ->
        {plan} = ITEM_PUBLISHED_THREE_DAYS

        checks =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()

            expect(displayNode.classList.contains(plan.type)).to.be.true
            expect(displayNode.classList.contains('is-published')).to.be.true

        checkChildrenComponents(element, ITEM_PUBLISHED_THREE_DAYS, checks)


  it 'should render the modal when published plan is clicked', ->
    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item: ITEM_PUBLISHED_THREE_DAYS} )
      .then ({element}) ->
        checkModalByClick(element, ITEM_PUBLISHED_THREE_DAYS)
        checkHasEditLinkBeenRendered(ITEM_PUBLISHED_THREE_DAYS.plan)


  it 'should render the modal matching route stats viewing', ->

    optionsWithParams =
      props:
        courseId: PLAN_COURSE_ID
        item: ITEM_PUBLISHED_THREE_DAYS
      routerParams:
        planId: ITEM_PUBLISHED_THREE_DAYS.plan.id
        courseId: PLAN_COURSE_ID
        date: moment(ITEM_PUBLISHED_THREE_DAYS.displays[0].rangeDuration.start).format(CALENDAR_DATE_FORMAT)

    Testing
      .renderComponent( Plan, optionsWithParams)
      .then ({dom, element}) ->
        {plan} = ITEM_PUBLISHED_THREE_DAYS
        {displaysComponents, detailsComponent} = checkChildrenComponents(element, ITEM_PUBLISHED_THREE_DAYS)
        {displayComponent} = _.first(displaysComponents)
        displayNode = displayComponent.getDOMNode()

        {detailsComponent} = checkChildrenComponents(element, ITEM_PUBLISHED_THREE_DAYS)
        checkHasMatchingModalBeenRendered(detailsComponent, displayNode, plan)
        checkHasEditLinkBeenRendered(plan)


  it 'should not render the modal if nonmatching route stats viewing', ->

    optionsWithParams =
      props:
        courseId: PLAN_COURSE_ID
        item: ITEM_PUBLISHED_THREE_DAYS
      routerParams:
        planId: ITEM_PUBLISHED_TWO_DAYS.plan.id
        courseId: PLAN_COURSE_ID
        date: moment(ITEM_PUBLISHED_TWO_DAYS.displays[0].rangeDuration.start).format(CALENDAR_DATE_FORMAT)

    Testing
      .renderComponent( Plan, optionsWithParams)
      .then ({dom, element}) ->
        {details} = checkChildrenComponents(element, ITEM_PUBLISHED_THREE_DAYS)

        expect(details).to.not.exist

  it 'should show as publishing when plan has job publishing', ->
    item = _.clone(ITEM_DRAFT_ONE_DAY)
    item.plan = fakePublishing(item.plan)

    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item} )
      .then ({dom, element}) ->
        {plan} = item

        checks =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()

            expect(displayNode.classList.contains(plan.type)).to.be.true
            expect(displayNode.classList.contains('is-publishing')).to.be.true

        checkChildrenComponents(element, item, checks)

  it 'should show publishing modal for a clicked first publish plan', ->
    item = _.clone(ITEM_DRAFT_ONE_DAY)
    item.plan = fakePublishing(item.plan)

    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item} )
      .then ({dom, element}) ->
        {detailsModal} = checkModalByClick(element, item)
        modalBody = detailsModal.querySelector('.modal-body')

        expect(detailsModal.classList.contains('is-publishing')).to.be.true
        expect(modalBody.querySelector('a')).to.not.exist
        expect(modalBody.innerText).to.contain('plan is publishing')

  it 'should show as published when plan is done publishing', ->
    item = _.clone(ITEM_DRAFT_ONE_DAY)
    item.plan = fakePublishing(item.plan)

    completeProgress =
      for: item.plan.id
      id: JOB_UUID
      status: 'completed'

    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item} )
      .then ({dom, element}) ->
        {plan} = item

        checks =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()
            expect(displayNode.classList.contains('is-publishing')).to.be.true

        checkChildrenComponents(element, item, checks)

        PlanPublishStore.emit("progress.#{plan.id}.#{completeProgress.status}", completeProgress)

        checksIsPublished =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()
            expect(displayNode.classList.contains('is-published')).to.be.true

        checkChildrenComponents(element, item, checksIsPublished)

  it 'should show as publishing when re-publishing', ->
    item = _.clone(ITEM_PUBLISHED_THREE_DAYS)
    item.plan = fakePublishing(item.plan)

    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item} )
      .then ({dom, element}) ->
        {plan} = item

        checks =
          display: (components, {display}) ->
            displayNode = components.displayComponent.getDOMNode()

            expect(displayNode.classList.contains(plan.type)).to.be.true
            expect(displayNode.classList.contains('is-publishing')).to.be.true

        checkChildrenComponents(element, item, checks)


  it 'should show full modal if re-publishing', ->
    item = _.clone(ITEM_PUBLISHED_THREE_DAYS)
    item.plan = fakePublishing(item.plan)

    Testing
      .renderComponent( Plan, props: {courseId: PLAN_COURSE_ID, item} )
      .then ({dom, element}) ->
        {detailsModal} = checkModalByClick(element, item)

        modalBody = detailsModal.querySelector('.modal-body')

        expect(detailsModal.classList.contains('is-publishing')).to.be.true
        checkHasEditLinkBeenRendered(item.plan)


# TODO
#   it 'should start checking publishing when publishing', ->
#   it 'should stop checkout publishing when asked to', ->
#   it 'should check for publishing subscribe if plan id props update', ->
#   it 'should check for publishing subscribe if plan isPublishing props update', ->

#   it 'should have more than one display for plans spanning multiple weeks', ->
#   it 'should render modal when clicking on any display for multiple weeks', ->

