jest.mock('../../../../src/helpers/router')
Router = require '../../../../src/helpers/router'

_ = require 'underscore'
cloneDeep = require 'lodash/cloneDeep'
moment = require 'moment-timezone'

Builder = require '../../../../src/components/task-plan/builder'
taskPlanEditingInitialize = require '../../../../src/components/task-plan/initialize-editing'
PlanMixin = require '../../../../src/components/task-plan/plan-mixin'
CourseDataHelper = require '../../../../src/helpers/course-data'

{TaskPlanActions, TaskPlanStore} = require '../../../../src/flux/task-plan'
{TaskingActions, TaskingStore} = require '../../../../src/flux/tasking'
{Testing, sinon, _, React, ReactDOM} = require '../../helpers/component-testing'
{commonActions} = require '../../helpers/utilities'
{ExtendBasePlan, PlanRenderHelper} = require '../../helpers/task-plan'

{CourseListingActions, CourseListingStore} = require '../../../../src/flux/course-listing'
{CourseStore, CourseActions} = require '../../../../src/flux/course'

{TimeStore} = require '../../../../src/flux/time'
TimeHelper = require '../../../../src/helpers/time'
TutorDateFormat = TimeStore.getFormat()
ISO_DATE_FORMAT = 'YYYY-MM-DD'

twoDaysBefore = moment(TimeStore.getNow()).subtract(2, 'days').format(ISO_DATE_FORMAT)
yesterday = moment(TimeStore.getNow()).subtract(1, 'day').format(ISO_DATE_FORMAT)
tomorrow = moment(TimeStore.getNow()).add(1, 'day').format(ISO_DATE_FORMAT)
dayAfter = moment(TimeStore.getNow()).add(2, 'day').format(ISO_DATE_FORMAT)
nextWeek = moment(TimeStore.getNow()).add(1, 'week').format(ISO_DATE_FORMAT)

getDateString = (value) -> TimeHelper.getZonedMoment(value).format(TutorDateFormat)
getISODateString = (value) -> TimeHelper.getZonedMoment(value).format(ISO_DATE_FORMAT)

COURSES = require '../../../../api/user/courses.json'
COURSE_ID = '1'
NEW_READING = ExtendBasePlan({id: "_CREATING_1", settings: {page_ids: []}}, false, false)
PUBLISHED_MODEL = ExtendBasePlan({
  id: '1'
  title: 'hello',
  description: 'description',
  published_at: twoDaysBefore,
  is_published: true}, {opens_at: twoDaysBefore, due_at: yesterday, target_id: COURSES[0].periods[0].id})

DUE_DATE_INPUT_SELECTOR = '.-assignment-due-date .date-wrapper input'
OPEN_DATE_INPUT_SELECTOR = '.-assignment-open-date .date-wrapper input'

getDateValue = (dom, type, periodId = 'all') ->
  wrapper = dom.querySelector(".tasking-date-times[data-period-id=\"#{periodId}\"]")
  return null unless wrapper
  dateStr =  wrapper.querySelector(".-assignment-#{type}-date .date-wrapper input")?.value + ' ' +
    wrapper.querySelector(".-assignment-#{type}-time input")?.value
  moment(dateStr, 'MM/DD/YYYY hh:mm a')

makeTaskingPeriodKey = (period) ->
  if period then "tasking-period#{period.id}" else "all"

helper = (model, routerQuery) ->
  {id} = model
  props = {id, courseId: "1"}
  # Load the plan into the store
  TaskPlanActions.loaded(model, id)

  unless TaskPlanStore.isNew(id)
    term = CourseDataHelper.getCourseBounds(props.courseId)
    taskPlanEditingInitialize(id, props.courseId, term)

  PlanMixin.props = props
  moreProps = PlanMixin.getStates()
  props = _.extend(props, moreProps)

  Testing.renderComponent( Builder, props: props, routerParams: {}, routerQuery: routerQuery)

updateBuilder = (element) ->
  element.forceUpdate()
  element.changeTaskPlan()

fakePeriodDisable = (element, disabledPeriod) ->
  fakeEvent =
    target:
      checked: false

  taskingRefName = makeTaskingPeriodKey(disabledPeriod)

  element.refs[taskingRefName].togglePeriodEnabled(fakeEvent)
  updateBuilder(element)

fakePeriodEnable = (element, enabledPeriod) ->
  fakeEvent =
    target:
      checked: true

  taskingRefName = makeTaskingPeriodKey(disabledPeriod)

  element.refs[taskingRefName].togglePeriodEnabled(fakeEvent)
  updateBuilder(element)

setDate = (element, model, period, date, type) ->
  TaskingActions.updateDate(model.id, period, type, date)
  updateBuilder(element)

hasAnyDueDate = (dom) ->
  availableDueDates = dom.querySelectorAll(DUE_DATE_INPUT_SELECTOR)
  _.any(availableDueDates, (dateInput) ->
    not _.isEmpty(dateInput.value)
  )

getDueDates = (dom) ->
  availableDueDates = dom.querySelectorAll(DUE_DATE_INPUT_SELECTOR)
  _.pluck(availableDueDates, 'value')

getOpenDates = (dom) ->
  availableDueDates = dom.querySelectorAll(OPEN_DATE_INPUT_SELECTOR)
  _.pluck(availableDueDates, 'value')

describe 'Task Plan Builder', ->
  beforeEach ->
    TaskPlanActions.reset()
    TaskingActions.reset()
    CourseListingActions.loaded(COURSES)

  it 'should load expected plan', ->
    helper(PUBLISHED_MODEL).then ({dom}) ->
      expect(dom.querySelector('#reading-title').value).to.equal(PUBLISHED_MODEL.title)
      descriptionValue = dom.querySelector('.assignment-description textarea').value
      expect(descriptionValue).to.equal(PUBLISHED_MODEL.description)

  it 'should allow editable periods radio if plan is not visible', ->
    helper(NEW_READING).then ({dom}) ->
      expect(dom.querySelector('#show-periods-radio')).to.not.be.null
      expect(dom.querySelector('#hide-periods-radio')).to.not.be.null

  it 'should not allow editable periods radio if plan is visible', ->
    helper(PUBLISHED_MODEL).then ({dom, element}) ->
      expect(dom.querySelector('#show-periods-radio')).to.be.null
      expect(dom.querySelector('#hide-periods-radio')).to.be.null
      expect(element.props.isVisibleToStudents).to.be.true

  it 'should not allow editable open date if plan is visible', ->
    helper(PUBLISHED_MODEL).then ({dom, element}) ->
      element.setAllPeriods()
      datepicker = dom.querySelector('.-assignment-open-date .datepicker__input-container input')
      inputDom = dom.querySelector('.-assignment-open-date .-tutor-date-input input')

      expect(datepicker).to.be.null
      expect(inputDom.disabled).to.be.true


  it 'hides periods by default', ->
    helper(NEW_READING).then ({dom, element}) ->
      expect(dom.querySelector('.tasking-plan.tutor-date-input')).to.be.null

  it 'can show individual periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setIndividualPeriods()
      expect(dom.querySelectorAll('.tasking-plan.tutor-date-input').length).to.equal(COURSES[0].periods.length)

  it 'sorts individual periods alphanumerically', ->
    helper(NEW_READING).then ({dom, element}) ->
      element.setIndividualPeriods()
      labels = _.pluck(dom.querySelectorAll('.tasking-plan label'), 'textContent')
      expect( labels ).to.be.deep.equal(['1st', '3rd', '4th', '5th', '6th', '10th', 'AAA', 'zZZ'])

  it 'does not load a default due at for all periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      expect(hasAnyDueDate(dom)).to.be.false

      element.setIndividualPeriods()
      expect(hasAnyDueDate(dom)).to.be.false

      element.setAllPeriods()
      expect(hasAnyDueDate(dom)).to.be.false

  it 'can clear due at when there is no common due at', ->
    onePeriod = COURSES[0].periods[0]
    anotherPeriod = COURSES[0].periods[1]

    helper(NEW_READING).then ({dom, element}) ->
      #set individual periods
      element.setIndividualPeriods()

      #set due dates to be different
      setDate(element, NEW_READING, onePeriod, tomorrow, 'due')
      setDate(element, NEW_READING, anotherPeriod, dayAfter, 'due')
      expect(hasAnyDueDate(dom)).to.be.true
      dueDates = getDueDates(dom)

      # set all periods, due at should be cleared
      element.setAllPeriods()
      expect(hasAnyDueDate(dom)).to.be.false

      # reset to individual, due dates should still exist
      element.setIndividualPeriods()
      expect(hasAnyDueDate(dom)).to.be.true
      expect(getDueDates(dom)).to.deep.equal(dueDates)


  it 'will default to queried due date if no common due at with a due date query string', ->
    onePeriod = COURSES[0].periods[0]
    anotherPeriod = COURSES[0].periods[1]

    helper(NEW_READING, {due_at: getISODateString(dayAfter)} ).then ({dom, element}) ->
      #set individual periods
      element.setIndividualPeriods()

      #set due dates to be different
      setDate(element, NEW_READING, onePeriod, tomorrow, 'due')
      setDate(element, NEW_READING, anotherPeriod, dayAfter, 'due')

      #set all periods
      element.setAllPeriods()

      #due at should reset to query string due at
      dueDates = getDueDates(dom)
      expect(getISODateString(dueDates[0])).to.be.equal(getISODateString(dayAfter))

  it 'can update open date for all periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      setDate(element, NEW_READING, {}, dayAfter, 'open')

      openDates = getOpenDates(dom)
      expect(getISODateString(openDates[0])).to.be.equal(getISODateString(dayAfter))

      {tasking_plans} = TaskPlanStore.get(NEW_READING.id)
      _.each tasking_plans, (tasking_plan) ->
        expect(getISODateString(tasking_plan.opens_at)).to.be.equal(getISODateString(dayAfter))

  it 'can update due date for all periods', ->
    helper(NEW_READING).then ({dom, element}) ->
      setDate(element, NEW_READING, {}, dayAfter, 'due')

      dueDates = getDueDates(dom)
      expect(getISODateString(dueDates[0])).to.be.equal(getISODateString(dayAfter))

      {tasking_plans} = TaskPlanStore.get(NEW_READING.id)
      _.each tasking_plans, (tasking_plan) ->
        expect(getISODateString(tasking_plan.due_at)).to.be.equal(getISODateString(dayAfter))

  it 'can disable individual periods', ->
    disabledPeriod = COURSES[0].periods[1]
    anotherDisabledPeriod = COURSES[0].periods[7]

    helper(NEW_READING).then ({dom, element}) ->
      element.setIndividualPeriods()

      fakePeriodDisable(element, disabledPeriod)
      fakePeriodDisable(element, anotherDisabledPeriod)

      {tasking_plans} = TaskPlanStore.get(NEW_READING.id)

      expect(tasking_plans).to.have.length(COURSES[0].periods.length - 2)
      expect(_.pluck(tasking_plans, 'id')).to.not.have
        .members(_.pluck([disabledPeriod, anotherDisabledPeriod], 'id'))

  xit 'can update open date for individual period', ->
    period = COURSES[0].periods[0]
    anotherPeriod = COURSES[0].periods[2]
    disabledPeriod = COURSES[0].periods[1]
    anotherDisabledPeriod = COURSES[0].periods[7]

    helper(NEW_READING).then ({dom, element}) ->
      element.setIndividualPeriods()

      fakePeriodDisable(element, disabledPeriod)
      fakePeriodDisable(element, anotherDisabledPeriod)

      allDueDate = getDateValue(dom, 'open')
      expect(allDueDate).to.not.be.ok

      dueDate = getDateValue(dom, 'open', period.id)
      expect(getISODateString(dueDate)).to.be.equal(getISODateString(tomorrow))

  it 'can update due date for individual period', ->
    period = COURSES[0].periods[0]
    disabledPeriod = COURSES[0].periods[1]
    anotherPeriod = COURSES[0].periods[2]

    helper(NEW_READING).then ({dom, element}) ->
      element.setIndividualPeriods()

      fakePeriodDisable(element, disabledPeriod)

      setDate(element, NEW_READING, anotherPeriod, dayAfter, 'due')
      setDate(element, NEW_READING, period, tomorrow, 'due')

      allDueDate = getDateValue(dom, 'due')
      expect(allDueDate).to.not.be.ok

      dueDate = getDateValue(dom, 'due', period.id)
      expect(getISODateString(dueDate)).to.be.equal(getISODateString(tomorrow))

  it 'sets the correct moment timezone on mount', ->
    courseId = COURSES[0].periods[0].id
    helper(NEW_READING).then ({dom, element}) ->
      expect([undefined, CourseStore.getTimezone(courseId)]).to.contain(moment().tz())

  it 'name and description fields are enabled when plan is past due', ->
    helper(PUBLISHED_MODEL).then ({dom}) ->
      expect(dom.querySelector('#reading-title').disabled).to.be.false
      expect(dom.querySelector('.assignment-description textarea').disabled).to.be.false

  it 'sets the default due date when based on query string', ->
    helper(NEW_READING, {due_at: getISODateString(dayAfter)} ).then ({dom, element}) ->
      expect(getISODateString(getDateValue(dom, 'due')))
        .to.be.equal(getISODateString(dayAfter))

  xit 'sets open_at to couse open date when the due date equals course open date', ->
    starts_at = moment(TimeStore.getNow()).add(1, 'week')
    course = cloneDeep(COURSES[0])
    starts_at_iso = TimeHelper.getZonedMoment(starts_at).format(ISO_DATE_FORMAT)
    course.starts_at = starts_at_iso
    course.ends_at = starts_at.clone().add(3, 'month').format(ISO_DATE_FORMAT)
    CourseActions.loaded(course, COURSE_ID)
    extendedReading =
      due_at: starts_at_iso
      opens_at: starts_at_iso

    helper(NEW_READING, extendedReading).then ({dom}) ->
      expect(getISODateString(getDateValue(dom, 'open')))
        .toEqual(starts_at_iso)

  it 'displays default timezone as a links to settings', ->
    helper(NEW_READING).then ({dom}) ->
      tz = dom.querySelector('.course-time-zone')
      expect(tz).to.exist
      expect(tz.textContent).to.include('Central Time')
