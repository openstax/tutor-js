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

{ScoresExportActions} = require '../flux/scores-export'

## //{PeriodActions} = require '../flux/period'

{TaskActions} = require '../flux/task'
{TaskPanelActions} = require '../flux/task-panel'
{TaskStepActions} = require '../flux/task-step'
{TaskPlanActions, TaskPlanStore} = require '../flux/task-plan'
{TaskTeacherReviewActions} = require '../flux/task-teacher-review'
{TaskPlanStatsActions} = require '../flux/task-plan-stats'

{PastTaskPlansActions} = require '../flux/past-task-plans'

{TocActions} = require '../flux/toc'
{ExerciseActions, ExerciseStore} = require '../flux/exercise'
{CourseListingActions} = require '../flux/course-listing'
{CCDashboardActions} = require '../flux/cc-dashboard'

{ReferenceBookActions} = require '../flux/reference-book'
{ReferenceBookPageActions} = require '../flux/reference-book-page'
{ReferenceBookExerciseActions} = require '../flux/reference-book-exercise'
{NotificationActions} = require '../flux/notifications'

{default: TaskPlanHelpers} = require '../helpers/task-plan'

{ default: User } = require '../models/user'
{ UserTerms, Term } = require '../models/user/terms'
{ default: Course } = require '../models/course'
{ default: Period } = require '../models/course/period'
{ default: Courses } = require '../models/courses-map'
{ default: Offerings } = require '../models/course/offerings'
{ default: CourseCreate } = require '../models/course/create'
{ default: TeacherTaskPlans } = require '../models/teacher-task-plans'
{ default: Student } = require '../models/course/student'
{ default: CourseEnroll } = require '../models/course/enroll'
{ default: Payments } = require '../models/payments'
{ default: Purchases } = require '../models/purchases'
{ default: Purchase } = require '../models/purchases/purchase'
{ CourseStudentTasks } = require '../models/student-tasks'
{ default: StudentTask } = require '../models/student/task'
{ default: CourseRoster } = require '../models/course/roster'
{ default: CourseScores } = require '../models/course/scores'
{ default: CourseTeacher } = require '../models/course/teacher'

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

  connectRead(ScoresExportActions, pattern: 'courses/{id}/performance/exports')
  connectCreate(ScoresExportActions,
    pattern: 'courses/{id}/performance/export', trigger: 'export', onSuccess: 'exported'
  )

  connectRead(JobActions, pattern: 'jobs/{id}', handledErrors: ['*'])
  connectRead(EcosystemsActions, url: 'ecosystems')


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

  connectRead(NotificationActions,
    trigger: 'loadUpdates', onSuccess: 'loadedUpdates', url: 'notifications', handledErrors: ['*']
  )

  # "User" is actually an instance, but connectModel works at the class level
  connectModelUpdate(User.constructor, 'saveTourView',
    pattern: 'user/tours/{id}'
   )

  connectModelRead(UserTerms, 'fetch', onSuccess: 'onLoaded', url: 'terms')
  connectModelUpdate(UserTerms, 'sign', onSuccess: 'onSigned', pattern: 'terms/{ids}', method: 'PUT')
  connectModelRead(Purchases.constructor, 'fetch', onSuccess: 'onLoaded', url: 'purchases')
  connectModelUpdate(Purchase, 'refund', {
    onSuccess: 'onRefunded', pattern: 'purchases/{item_uuid}/refund', method: 'PUT',
    data: -> { survey: @refund_survey }
  })
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

  connectModelUpdate(Student, 'saveStudentId', pattern: 'students/{id}', onSuccess: 'onApiRequestComplete')
  connectModelUpdate(Student, 'savePeriod', pattern: 'students/{id}', onSuccess: 'onApiRequestComplete')
  connectModelDelete(Student, 'drop', pattern: 'students/{id}', onSuccess: 'onApiRequestComplete' )
  connectModelUpdate(Student, 'unDrop', pattern: 'students/{id}/undrop', method: 'PUT', onSuccess: 'onApiRequestComplete' )


  connectModelCreate(CourseEnroll, 'create', url: 'enrollment_changes', onSuccess: 'onApiRequestComplete', onFail: 'setApiErrors')
  connectModelUpdate(CourseEnroll, 'confirm',
    pattern: 'enrollment_changes/{id}/approve', method: 'PUT'
    onSuccess: 'onApiRequestComplete', onFail: 'setApiErrors')

  connectModelRead(CourseStudentTasks, 'fetch', onSuccess: 'onLoaded', pattern: 'courses/{courseId}/dashboard')
  connectModelDelete(StudentTask, 'hide', onSuccess: 'onHidden', pattern: 'tasks/{id}')

  connectModelUpdate(Course, 'save', pattern: 'courses/{id}', onSuccess: 'onApiRequestComplete')


  connectModelRead(CourseRoster, 'fetch', pattern: 'courses/{courseId}/roster', onSuccess: 'onApiRequestComplete')


  connectModelDelete(CourseTeacher, 'drop', pattern: 'teachers/{id}', onSuccess: 'onDropped')

  connectModelCreate(Period, 'create', pattern: 'courses/{courseId}/periods', onSuccess: 'afterCreate')
  connectModelUpdate(Period, 'save', pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete')
  connectModelDelete(Period, 'archive', pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete')
  connectModelUpdate(Period, 'unarchive', pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete')

  connectModelRead(CourseScores, 'fetch',
    pattern: 'courses/{courseId}/performance',
    onSuccess: 'onFetchComplete'
  )


  # connectRead(ScoresActions, )
  # connectModify(ScoresActions,
  #   trigger: 'acceptLate', onSuccess: 'acceptedLate', pattern: 'tasks/{id}/accept_late_work'
  # )
  # connectModify(ScoresActions,
  #   trigger: 'rejectLate', onSuccess: 'rejectedLate', pattern: 'tasks/{id}/reject_late_work'
  # )


  # connectCreate(PeriodActions, pattern: 'courses/{id}/periods',
  #   data: (id, data) -> data
  # )
  # connectUpdate(PeriodActions,
  #   url: (courseId, periodId, data) -> "periods/#{periodId}"
  #   data: (courseId, periodId, data) -> data
  # )
  # connectDelete(PeriodActions, pattern: 'periods/{id}')
  # connectModify(PeriodActions, pattern: 'periods/{id}/restore', trigger: 'restore', onSuccess: 'restored')




  # connectDelete(RosterActions, pattern: 'students/{id}')
  # connectUpdate(RosterActions, pattern: 'students/{id}',
  #   data: (id, data) -> data
  # )

  # connectModify(RosterActions, pattern: 'students/{studentId}/undrop', trigger: 'undrop', onSuccess: 'undropped',
  #   errorHandlers:
  #     already_active: 'onUndropAlreadyActive'
  #     student_identifier_has_already_been_taken: 'recordDuplicateStudentIdError'
  # )
  # connectUpdate(RosterActions,
  #   pattern: 'students/{studentId}', trigger: 'saveStudentIdentifier', onSuccess: 'savedStudentIdentifier',
  #   errorHandlers:
  #     student_identifier_has_already_been_taken: 'recordDuplicateStudentIdError'
  #   data: ({courseId, studentId}) ->
  #     student_identifier: RosterStore.getStudentIdentifier(courseId, studentId)
  # )

BOOTSTRAPED_MODELS = {
  user:     User,
  courses:  Courses,
  payments: Payments,
}

start = (bootstrapData) ->
  for storeId, model of BOOTSTRAPED_MODELS
    data = bootstrapData[storeId]
    model.bootstrap(data)
  startAPI()

module.exports = {startAPI, start}
