# This file manages all async state transitions.
#
# These attach to actions to help state changes along.
#
# For example, `TaskActions.load` everntually yields either
# `TaskActions.loaded` or `TaskActions.FAILED`
{
  connectModify, connectCreate, connectRead, connectUpdate, connectDelete
  connectModelCreate, connectModelRead, connectModelUpdate, connectModelDelete
} = require './adapter'
pick = require 'lodash/pick'
assign = require 'lodash/assign'
{CourseActions} = require '../flux/course'
{CoursePracticeActions} = require '../flux/practice'
{CourseGuideActions} = require '../flux/guide'
{JobActions} = require '../flux/job'
{EcosystemsActions} = require '../flux/ecosystems'
PerformanceForecast = require '../flux/performance-forecast'

{ScoresActions} = require '../flux/scores'
{ScoresExportActions} = require '../flux/scores-export'
{RosterActions, RosterStore} = require '../flux/roster'
{PeriodActions} = require '../flux/period'

{TaskActions} = require '../flux/task'
{TaskPanelActions} = require '../flux/task-panel'
{TaskStepActions} = require '../flux/task-step'
{TaskPlanActions, TaskPlanStore} = require '../flux/task-plan'
{TaskTeacherReviewActions} = require '../flux/task-teacher-review'
{TaskPlanStatsActions} = require '../flux/task-plan-stats'

{PastTaskPlansActions} = require '../flux/past-task-plans'

{TocActions} = require '../flux/toc'
{ExerciseActions, ExerciseStore} = require '../flux/exercise'
{StudentDashboardActions} = require '../flux/student-dashboard'
{CourseListingActions} = require '../flux/course-listing'
{CCDashboardActions} = require '../flux/cc-dashboard'

{ReferenceBookActions} = require '../flux/reference-book'
{ReferenceBookPageActions} = require '../flux/reference-book-page'
{ReferenceBookExerciseActions} = require '../flux/reference-book-exercise'
{NotificationActions} = require '../flux/notifications'

{default: TaskPlanHelpers} = require '../helpers/task-plan'

{ default: User } = require '../models/user'
{ UserTerms, Term } = require '../models/user/terms'
{ default: Courses } = require '../models/courses-map'
{ default: Offerings } = require '../models/course/offerings'
{ default: CourseCreate } = require '../models/course/create'
{ default: TeacherTaskPlans } = require '../models/teacher-task-plans'
{ default: Student } = require '../models/course/student'
{ default: CourseEnroll } = require '../models/course/enroll'

BOOTSTRAPED_MODELS = {
  user:    User.bootstrap,
  courses: Courses.bootstrap
}


startAPI = ->
  connectRead(TaskActions, pattern: 'tasks/{id}')
  connectDelete(TaskActions, pattern: 'tasks/{id}')

  connectRead(TaskPlanActions, pattern: 'plans/{id}')
  connectDelete(TaskPlanActions, pattern: 'plans/{id}')

  connectUpdate(TaskPlanActions, {data: TaskPlanStore.getChanged}, TaskPlanHelpers.apiEndpointOptions)

  connectUpdate(TaskPlanActions, {
    trigger: 'saveSilent'
    handleError: (args...) ->
      TaskPlanActions.erroredSilent(args...)
      true
    data: TaskPlanStore.getChanged
  }, TaskPlanHelpers.apiEndpointOptions)

  connectRead(TaskPlanStatsActions, pattern: 'plans/{id}/stats')
  connectRead(TaskTeacherReviewActions, pattern: 'plans/{id}/review')

  connectRead(ExerciseActions, {trigger: 'loadForEcosystem', onSuccess: 'loadedForEcosystem'},
    (id, pageIds, requestType = 'homework_core') ->
      url = "ecosystems/#{id}/exercises/#{requestType}"
      params =
        page_ids: pageIds

      {url, params}
  )

  connectRead(ExerciseActions, {trigger: 'loadForCourse', onSuccess: 'loadedForCourse'},
    (id, pageIds, ecosystemId = null, requestType = 'homework_core') ->
      url = "courses/#{id}/exercises/#{requestType}"
      params =
        page_ids: pageIds
      params.ecosystem_id = ecosystemId if ecosystemId?

      {url, params}
  )

  connectModify(ExerciseActions,
    pattern: 'courses/{id}/exercises', trigger: 'saveExerciseExclusion', onSuccess: 'exclusionsSaved'
    data: ->
      _.map ExerciseStore.getUnsavedExclusions(), (is_excluded, id) -> {id, is_excluded}
  )

  connectRead(TocActions, pattern: 'ecosystems/{id}/readings')
  connectRead(CourseGuideActions, pattern: 'courses/{id}/guide')
  connectRead(CourseActions, pattern: 'courses/{id}')
  connectUpdate(CourseActions, pattern: 'courses/{id}',
    data: (id, data) -> data
  )

  connectRead(CCDashboardActions, pattern: 'courses/{id}/cc/dashboard')
  connectRead(CoursePracticeActions, pattern: 'courses/{id}/practice')

  connectCreate(CoursePracticeActions,
    url: ({courseId, query}) ->
      url = "courses/#{courseId}/practice"
      if query?.worst then "#{url}/worst" else url
    data: ({courseId, query}) -> query
  )

  connectRead(PerformanceForecast.Student.actions, pattern: 'courses/{id}/guide')
  connectRead(PerformanceForecast.Teacher.actions, pattern: 'courses/{id}/teacher_guide')
  connectRead(PerformanceForecast.TeacherStudent.actions, (id, {roleId}) ->
    url = "courses/#{id}/guide/role/#{roleId}"
    data = {id, roleId}
    {url, data}
  )

  connectRead(ScoresActions, pattern: 'courses/{id}/performance')
  connectRead(ScoresExportActions, pattern: 'courses/{id}/performance/exports')
  connectCreate(ScoresExportActions,
    pattern: 'courses/{id}/performance/export', trigger: 'export', onSuccess: 'exported'
  )

  connectModify(ScoresActions,
    trigger: 'acceptLate', onSuccess: 'acceptedLate', pattern: 'tasks/{id}/accept_late_work'
  )

  connectModify(ScoresActions,
    trigger: 'rejectLate', onSuccess: 'rejectedLate', pattern: 'tasks/{id}/reject_late_work'
  )

  connectRead(JobActions, pattern: 'jobs/{id}', handledErrors: ['*'])
  connectRead(EcosystemsActions, url: 'ecosystems')
  connectDelete(RosterActions,
    pattern: 'teachers/{id}', trigger: 'teacherDelete', onSuccess: 'teacherDeleted'
  )
  connectDelete(RosterActions, pattern: 'students/{id}')
  connectUpdate(RosterActions, pattern: 'students/{id}',
    data: (id, data) -> data
  )

  connectModify(RosterActions, pattern: 'students/{studentId}/undrop', trigger: 'undrop', onSuccess: 'undropped',
    errorHandlers:
      already_active: 'onUndropAlreadyActive'
      student_identifier_has_already_been_taken: 'recordDuplicateStudentIdError'
  )
  connectUpdate(RosterActions,
    pattern: 'students/{studentId}', trigger: 'saveStudentIdentifier', onSuccess: 'savedStudentIdentifier',
    errorHandlers:
      student_identifier_has_already_been_taken: 'recordDuplicateStudentIdError'
    data: ({courseId, studentId}) ->
      student_identifier: RosterStore.getStudentIdentifier(courseId, studentId)
  )
  # this isn't currently used, it's the old endpoint for a teacher adding a student
  # connectCreate(RosterActions, pattern: 'courses/{id}/roster')
  connectRead(RosterActions, pattern: 'courses/{id}/roster')

  connectCreate(PeriodActions, pattern: 'courses/{id}/periods',
    data: (id, data) -> data
  )
  connectUpdate(PeriodActions,
    url: (courseId, periodId, data) -> "periods/#{periodId}"
    data: (courseId, periodId, data) -> data
  )
  connectDelete(PeriodActions, pattern: 'periods/{id}')
  connectModify(PeriodActions, pattern: 'periods/{id}/restore', trigger: 'restore', onSuccess: 'restored')

  connectRead(TaskStepActions, pattern: 'steps/{id}')
  connectRead(TaskStepActions, pattern: 'steps/{id}', trigger: 'loadPersonalized',
    handleError: (args...) ->
      TaskStepActions.loadedNoPersonalized(args...)
      true
  )
  connectModify(TaskActions, pattern: 'steps/{id}/completed', trigger: 'completeStep', onSuccess: 'stepCompleted')

  connectUpdate(TaskStepActions, pattern: 'steps/{id}', trigger: 'setFreeResponseAnswer',
    data: (id, freeResponse) ->
      {free_response: freeResponse}
  )
  connectUpdate(TaskStepActions, pattern: 'steps/{id}', trigger: 'setAnswerId',
    data: (id, answerId) ->
      {answer_id: answerId}
  )

  connectRead(PastTaskPlansActions, (courseId) ->
    url: "courses/#{courseId}/plans"
    params:
      clone_status: 'unused_source'
  )

  connectRead(CourseListingActions, url: 'user/courses')

  connectRead(ReferenceBookActions, pattern: 'ecosystems/{id}/readings')
  connectRead(ReferenceBookPageActions, pattern: 'pages/{id}')
  connectRead(ReferenceBookPageActions, pattern: 'pages/{id}', trigger: 'loadSilent', handledErrors: ['*'])
  connectRead(ReferenceBookExerciseActions, url: (url) -> url)

  connectRead(StudentDashboardActions, pattern: 'courses/{id}/dashboard')
  connectDelete(StudentDashboardActions,
    trigger: 'hide', onSuccess: 'hidden', pattern: 'tasks/{id}'
  )
  connectRead(NotificationActions,
    trigger: 'loadUpdates', onSuccess: 'loadedUpdates', url: 'notifications', handledErrors: ['*']
  )

  # "User" is actually an instance, but connectModel works at the class level
  connectModelUpdate(User.constructor, 'saveTourView',
    pattern: 'user/tours/{id}'
   )

  connectModelRead(UserTerms, 'fetch', onSuccess: 'onLoaded', url: 'terms')
  connectModelUpdate(UserTerms, 'sign', onSuccess: 'onSigned', pattern: 'terms/{ids}', method: 'PUT')

  connectModelCreate(User.constructor, 'logEvent',
    pattern: 'log/event/{category}/{code}'
    data: ({ data }) -> { data }

   )
  connectModelRead(Offerings.constructor, 'fetch', url: 'offerings', onSuccess: 'onLoaded')

  connectModelCreate(CourseCreate, 'save', onSuccess: 'onCreated')
  connectModelRead(TeacherTaskPlans.constructor, 'fetch',
    pattern: 'courses/{courseId}/dashboard',
    onSuccess: 'onLoaded'
    params: ({ id, startAt, endAt }) ->
      start_at: startAt
      end_at: endAt
  )

  connectModelUpdate(Student, 'save', pattern: 'user/courses/{courseId}/student', onSuccess: 'onSaved')

  connectModelCreate(CourseEnroll, 'create', url: 'enrollment_changes', onSuccess: 'onApiRequestComplete', onFail: 'setApiErrors')
  connectModelUpdate(CourseEnroll, 'confirm',
    pattern: 'enrollment_changes/{id}/approve', method: 'PUT'
    onSuccess: 'onApiRequestComplete', onFail: 'setApiErrors')



start = (bootstrapData) ->
  for storeId, action of BOOTSTRAPED_MODELS
    data = bootstrapData[storeId]
    action(data) if data
  startAPI()

module.exports = {startAPI, start}
