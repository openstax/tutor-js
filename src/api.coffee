# This file manages all async state transitions.
#
# These attach to actions to help state changes along.
#
# For example, `TaskActions.load` everntually yields either
# `TaskActions.loaded` or `TaskActions.FAILED`
_ = require 'underscore'

{apiHelper, IS_LOCAL} = require './helpers/api'


{CurrentUserActions, CurrentUserStore} = require './flux/current-user'
{CourseActions} = require './flux/course'
{JobActions} = require './flux/job'
{EcosystemsActions} = require './flux/ecosystems'
PerformanceForecast = require './flux/performance-forecast'

{ScoresActions} = require './flux/scores'
{ScoresExportActions} = require './flux/scores-export'
{RosterActions} = require './flux/roster'
{PeriodActions} = require './flux/period'

{TaskActions} = require './flux/task'
{TaskStepActions} = require './flux/task-step'
{TaskPlanActions, TaskPlanStore} = require './flux/task-plan'
{TaskTeacherReviewActions, TaskTeacherReviewStore} = require './flux/task-teacher-review'
{TaskPlanStatsActions, TaskPlanStatsStore} = require './flux/task-plan-stats'

{TocActions} = require './flux/toc'
{ExerciseActions, ExerciseStore} = require './flux/exercise'
{TeacherTaskPlanActions, TeacherTaskPlanStore} = require './flux/teacher-task-plan'
{StudentDashboardActions} = require './flux/student-dashboard'
{CourseListingActions, CourseListingStore} = require './flux/course-listing'
{CCDashboardStore, CCDashboardActions} = require './flux/cc-dashboard'

{ReferenceBookActions, ReferenceBookStore} = require './flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require './flux/reference-book-page'
{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require './flux/reference-book-exercise'

{NotificationActions, NotificationStore} = require './flux/notifications'

BOOTSTRAPED_STORES = {
  user:   CurrentUserActions.loaded
  courses: CourseListingActions.loaded
}

start = (bootstrapData) ->
  for storeId, action of BOOTSTRAPED_STORES
    data = bootstrapData[storeId]
    action(data) if data

  apiHelper TaskActions, TaskActions.load, TaskActions.loaded, 'GET', (id) ->
    url: "/api/tasks/#{id}"

  # apiHelper TaskActions, TaskActions.save, TaskActions.saved, 'PATCH', (id, obj) ->
  #   url: "/api/tasks/#{id}"
  #   payload: obj

  saveHelper = (id) ->
    obj = TaskPlanStore.getChangedCleanedTaskings(id)
    if TaskPlanStore.isNew(id)
      # HACK: to make the JSON valid
      obj.type ?= 'reading'
      courseId = obj._HACK_courseId
      delete obj._HACK_courseId

      url: "/api/courses/#{courseId}/plans"
      httpMethod: 'POST'
      payload: obj
    else
      url: "/api/plans/#{id}"
      httpMethod: 'PATCH'
      payload: obj

  apiHelper TaskPlanActions, TaskPlanActions.save, TaskPlanActions.saved, null, saveHelper

  apiHelper TaskPlanActions, TaskPlanActions.delete, TaskPlanActions.deleted, 'DELETE', saveHelper

  apiHelper TaskPlanActions, TaskPlanActions.load , TaskPlanActions.loaded, 'GET', (id) ->
    url: "/api/plans/#{id}"

  apiHelper TaskPlanStatsActions, TaskPlanStatsActions.load , TaskPlanStatsActions.loaded, 'GET', (id) ->
    url: "/api/plans/#{id}/stats"

  # Note: the below exercise endpoints share the same store.
  # The contents of the json payload is identical, except the second includes an is_excluded flag
  # since it operates at the course level
  #
  # This one loads using an ecosystemId
  apiHelper ExerciseActions, ExerciseActions.loadForEcosystem,
    ExerciseActions.loadedForEcosystem, 'GET', (ecosystemId, page_ids, requestType = 'homework_core') ->
      url: "/api/ecosystems/#{ecosystemId}/exercises/#{requestType}?#{toParams({page_ids})}"
  # And this one loads using a courseId
  apiHelper ExerciseActions, ExerciseActions.loadForCourse,
    ExerciseActions.loadedForCourse, 'GET', (courseId, pageIds, ecosystemId = null, requestType = 'homework_core') ->
      params = { page_ids: pageIds }
      params['ecosystem_id'] = ecosystemId if ecosystemId?
      url: "/api/courses/#{courseId}/exercises/#{requestType}?#{toParams(params)}"

  apiHelper ExerciseActions, ExerciseActions.saveExerciseExclusion,
    ExerciseActions.exclusionsSaved, 'PUT', (courseId) ->
      url: "/api/courses/#{courseId}/exercises"
      payload: _.map ExerciseStore.getUnsavedExclusions(), (is_excluded, id) -> {id, is_excluded}

  apiHelper TocActions, TocActions.load, TocActions.loaded, 'GET', (ecosystemId) ->
    url: "/api/ecosystems/#{ecosystemId}/readings"

  apiHelper CourseActions, CourseActions.loadPractice, CourseActions.loadedPractice, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/practice"

  apiHelper CourseActions, CourseActions.loadGuide, CourseActions.loadedGuide, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/guide"

  apiHelper CourseActions, CourseActions.save, CourseActions.saved, 'PATCH', (courseId, params) ->
    url: "/api/courses/#{courseId}"
    payload: params

  apiHelper CCDashboardActions, CCDashboardActions.load, CCDashboardActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/cc/dashboard"

  createMethod = if IS_LOCAL then 'GET' else 'POST' # Hack to get back a full practice on create when on local
  apiHelper CourseActions, CourseActions.createPractice, CourseActions.createdPractice, createMethod, (courseId, params) ->
    url: "/api/courses/#{courseId}/practice"
    payload: params

  apiHelper CourseActions, CourseActions.load, CourseActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}"

  apiHelper PerformanceForecast.Student.actions, PerformanceForecast.Student.actions.load,
    PerformanceForecast.Student.actions.loaded, 'GET', (id) -> url: "/api/courses/#{id}/guide"

  apiHelper PerformanceForecast.Teacher.actions, PerformanceForecast.Teacher.actions.load,
    PerformanceForecast.Teacher.actions.loaded, 'GET', (id) -> url: "/api/courses/#{id}/teacher_guide"

  apiHelper PerformanceForecast.TeacherStudent.actions, PerformanceForecast.TeacherStudent.actions.load,
    PerformanceForecast.TeacherStudent.actions.loaded, 'GET', (id, {roleId}) ->
      url: "/api/courses/#{id}/guide/role/#{roleId}"

  apiHelper ScoresActions, ScoresActions.load, ScoresActions.loaded, 'GET', (id) ->
    url: "/api/courses/#{id}/performance"
  apiHelper ScoresActions, ScoresActions.acceptLate, ScoresActions.acceptedLate, 'PUT', (id) ->
    url: "/api/tasks/#{id}/accept_late_work"
  apiHelper ScoresActions, ScoresActions.rejectLate, ScoresActions.rejectedLate, 'PUT', (id) ->
    url: "/api/tasks/#{id}/reject_late_work"
  apiHelper StudentDashboardActions, StudentDashboardActions.hide, StudentDashboardActions.hidden, 'DELETE', (id) ->
    url: "/api/tasks/#{id}"


  apiHelper ScoresExportActions, ScoresExportActions.load, ScoresExportActions.loaded, 'GET', (id) ->
    url: "/api/courses/#{id}/performance/exports"

  apiHelper ScoresExportActions, ScoresExportActions.export, ScoresExportActions.exported, 'POST', (id) ->
    url: "/api/courses/#{id}/performance/export"

  apiHelper JobActions, JobActions.load, JobActions.loaded, 'GET', (id) ->
    url: "/api/jobs/#{id}"
  , displayError: false

  apiHelper EcosystemsActions, EcosystemsActions.load, EcosystemsActions.loaded, 'GET', ->
    url: "/api/ecosystems"

  apiHelper RosterActions, RosterActions.teacherDelete, RosterActions.teacherDeleted, 'DELETE', (id) ->
    url: "/api/teachers/#{id}"

  apiHelper RosterActions, RosterActions.delete, RosterActions.deleted, 'DELETE', (id) ->
    url: "/api/students/#{id}"
  apiHelper RosterActions, RosterActions.save, RosterActions.saved, 'PATCH', (id, params) ->
    url: "/api/students/#{id}", payload: params
  apiHelper RosterActions, RosterActions.undrop, RosterActions.undropped, 'PUT', (id) ->
    url: "/api/students/#{id}/undrop"
  apiHelper RosterActions, RosterActions.create, RosterActions.created, createMethod, (courseId, params) ->
    url: "/api/courses/#{courseId}/roster", payload: params
  apiHelper RosterActions, RosterActions.load, RosterActions.loaded, 'GET', (id) ->
    url: "/api/courses/#{id}/roster"

  apiHelper PeriodActions, PeriodActions.create, PeriodActions.created, createMethod, (courseId, params) ->
    url: "/api/courses/#{courseId}/periods", payload: params
  apiHelper PeriodActions, PeriodActions.save, PeriodActions.saved, 'PATCH', (id, period, params) ->
    url: "/api/periods/#{period}", payload: params
  apiHelper PeriodActions, PeriodActions.delete, PeriodActions.deleted, 'DELETE', (id) ->
    url: "/api/periods/#{id}"
  apiHelper PeriodActions, PeriodActions.restore, PeriodActions.restored, 'PUT', (id) ->
    url: "/api/periods/#{id}/restore"

  apiHelper TaskStepActions, TaskStepActions.load, TaskStepActions.loaded, 'GET', (id) ->
    throw new Error('BUG: Wrong type') unless typeof id is 'string' or typeof id is 'number'
    url: "/api/steps/#{id}"

  # # Go from complete to load so we fetch the new JSON
  # apiHelper TaskStepActions, TaskStepActions.complete, TaskStepActions.loaded, 'PUT', (id) ->
  #   url: "/api/steps/#{id}/completed"

  # Go from complete to load so we fetch the new JSON
  apiHelper TaskStepActions, TaskStepActions.complete, TaskStepActions.completed, 'PUT', (id) ->
    url: "/api/steps/#{id}/completed"

  apiHelper TaskStepActions, TaskStepActions.loadRecovery, TaskStepActions.loadedRecovery, 'PUT', (id) ->
    url: "/api/steps/#{id}/recovery"

  apiHelper TaskStepActions, TaskStepActions.setFreeResponseAnswer, TaskStepActions.saved, 'PATCH', (id, free_response) ->
    url: "/api/steps/#{id}"
    payload: {free_response}

  apiHelper TaskStepActions, TaskStepActions.setAnswerId, TaskStepActions.saved, 'PATCH', (id, answer_id) ->
    url: "/api/steps/#{id}"
    payload: {answer_id}

  apiHelper TaskTeacherReviewActions, TaskTeacherReviewActions.load, TaskTeacherReviewActions.loaded, 'GET', (id) ->
    url: "/api/plans/#{id}/review"

  apiHelper TeacherTaskPlanActions, TeacherTaskPlanActions.load, TeacherTaskPlanActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/dashboard"

  apiHelper CurrentUserActions, CurrentUserActions.load, CurrentUserActions.loaded, 'GET', ->
    url: '/api/user'

  apiHelper CourseListingActions, CourseListingActions.load, CourseListingActions.loaded, 'GET', ->
    url: '/api/user/courses'

  apiHelper ReferenceBookActions, ReferenceBookActions.load, ReferenceBookActions.loaded, 'GET', (ecosystemId) ->
    url: "/api/ecosystems/#{ecosystemId}/readings"


  apiHelper ReferenceBookPageActions, ReferenceBookPageActions.load, ReferenceBookPageActions.loaded, 'GET', (cnxId) ->
    url: "/api/pages/#{cnxId}"

  apiHelper ReferenceBookPageActions, ReferenceBookPageActions.loadSilent, ReferenceBookPageActions.loaded, 'GET', (cnxId) ->
    url: "/api/pages/#{cnxId}"
  , displayError: false

  apiHelper ReferenceBookExerciseActions,
    ReferenceBookExerciseActions.load,
    ReferenceBookExerciseActions.loaded,
    'GET',
    (exerciseAPIUrl) ->
      url: exerciseAPIUrl

  apiHelper StudentDashboardActions, StudentDashboardActions.load, StudentDashboardActions.loaded, 'GET', (courseId) ->
    url: "/api/courses/#{courseId}/dashboard"

  apiHelper NotificationActions, NotificationActions.loadUpdates, NotificationActions.loadedUpdates, 'GET', ->
    url: "/api/notifications"
  , displayError: false


  CurrentUserActions.logout.addListener 'trigger', ->
    # Logging out programatically needs to be done via a form submission or follow redirects
    # $.ajax('/accounts/logout', {method: 'DELETE'})
    # .always ->
    console.warn('Logging out programatically needs to be done via a form submission or follow redirects')
    window.location.href = '/'


module.exports = {start}
