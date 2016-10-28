moment = require 'moment-timezone'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{CourseStore, CourseActions}   = require '../../flux/course'
TimeHelper = require '../../helpers/time'
{TimeStore} = require '../../flux/time'
{TaskingStore, TaskingActions} = require '../../flux/tasking'

Router = require '../../helpers/router'

getOpensAtDefault = ->
  moment(TimeStore.getNow()).add(1, 'day').format(TimeHelper.ISO_DATE_FORMAT)

getQueriedOpensAt = (taskPlanId) ->
  {opens_at} = Router.currentQuery() # attempt to read the open date from query params
  isNewPlan = TaskPlanStore.isNew(taskPlanId)
  opensAt = if opens_at and isNewPlan then TimeHelper.getMomentPreserveDate(opens_at)
  if not opensAt
    # default open date is tomorrow
    opensAt = getOpensAtDefault()

  # if there is a queried due date, make sure it's not the same as the open date
  dueAt = getQueriedDueAt()

  if dueAt?
    dueAtMoment = TimeHelper.getMomentPreserveDate(dueAt)
    # there's a corner case is certain timezones where isAfter doesn't quite cut it
    # and we need to check that the ISO strings don't match
    unless (dueAtMoment.isAfter(opensAt, 'day') and dueAtMoment.format(TimeHelper.ISO_DATE_FORMAT) isnt opensAt)
      # make open date today if default due date is tomorrow
      opensAt = moment(TimeStore.getNow()).format(TimeHelper.ISO_DATE_FORMAT)

  opensAt

getQueriedDueAt = ->
  {due_at} = Router.currentQuery() # attempt to read the due date from query params
  dueAt = if due_at then TimeHelper.getMomentPreserveDate(due_at).format(TimeHelper.ISO_DATE_FORMAT)


setPeriodDefaults = (courseId, planId) ->

  if TaskPlanStore.isNew(planId)
    TaskingActions.create(planId, {open_date: getQueriedOpensAt(), due_date: getQueriedDueAt()})
  else
    {tasking_plans} = TaskPlanStore.get(planId)
    TaskingActions.loadTaskings(planId, tasking_plans)

  nextState = {}
  nextState.showingPeriods = not TaskingStore.getTaskingsIsAll(planId)
  nextState


loadCourseDefaults = (courseId) ->

  courseDefaults = CourseStore.getTimeDefaults(courseId)

  return unless courseDefaults?

  periods = CourseStore.getPeriods(courseId)
  TaskingActions.loadDefaults(courseId, courseDefaults, periods)


module.exports = (taskPlanId, courseId) ->
  courseTimezone = CourseStore.getTimezone(courseId)
  TimeHelper.syncCourseTimezone(courseTimezone)
  TaskingActions.loadTaskToCourse(taskPlanId, courseId)
  loadCourseDefaults(courseId)

  #set the periods defaults only after the timezone has been synced
  return setPeriodDefaults(courseId, taskPlanId)
