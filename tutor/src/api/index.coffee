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
{EcosystemsActions} = require '../flux/ecosystems'
PerformanceForecast = require '../flux/performance-forecast'

{TaskActions} = require '../flux/task'
{TaskPanelActions} = require '../flux/task-panel'
{TaskStepActions} = require '../flux/task-step'
{TaskPlanActions, TaskPlanStore} = require '../flux/task-plan'

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

{ default: Job} = require '../models/job'
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
{ default: CourseLMS } = require '../models/course/lms'
{ default: CourseScores } = require '../models/course/scores'
{ default: ScoresExport } = require '../models/jobs/scores-export'
{ default: TaskPlanPublish } = require '../models/jobs/task-plan-publish'
{ default: LmsPushScores } = require '../models/jobs/lms-score-push'
{ default: TaskResult } = require '../models/course/scores/task-result'
{ default: CourseTeacher } = require '../models/course/teacher'
{ default: TeacherTaskPlan } = require '../models/task-plan/teacher'
{ default: TaskPlanStats } = require '../models/task-plan/stats'

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


  connectModelCreate(CourseEnroll, 'create', url: 'enrollment', onSuccess: 'onEnrollmentCreate', onFail: 'setApiErrors')
  connectModelUpdate(CourseEnroll, 'confirm',
    pattern: 'enrollment/{id}/approve', method: 'PUT'
    onSuccess: 'onApiRequestComplete', onFail: 'setApiErrors')

  connectModelRead(CourseStudentTasks, 'fetch', onSuccess: 'onLoaded', pattern: 'courses/{courseId}/dashboard')
  connectModelDelete(StudentTask, 'hide', onSuccess: 'onHidden', pattern: 'tasks/{id}')

  connectModelUpdate(Course, 'save', pattern: 'courses/{id}', onSuccess: 'onApiRequestComplete')

  connectModelRead(CourseLMS, 'fetch', pattern: 'lms/{course.id}', onSuccess: 'onApiRequestComplete')

  connectModelUpdate(LmsPushScores, 'start', method: 'PUT', pattern: 'lms/courses/{course.id}/push_scores', onSuccess: 'onStarted')

  connectModelRead(CourseRoster, 'fetch', pattern: 'courses/{courseId}/roster', onSuccess: 'onApiRequestComplete')

  connectModelDelete(CourseTeacher, 'drop', pattern: 'teachers/{id}', onSuccess: 'onDropped')

  connectModelCreate(Period, 'create', pattern: 'courses/{courseId}/periods', onSuccess: 'afterCreate')
  connectModelUpdate(Period, 'save', pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete')
  connectModelDelete(Period, 'archive', pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete')
  connectModelUpdate(Period, 'unarchive', pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete')

  connectModelRead(CourseScores, 'fetch',
    pattern: 'courses/{courseId}/performance', onSuccess: 'onFetchComplete')

  connectModelUpdate(TaskResult, 'acceptLate', method: 'PUT', pattern: 'tasks/{id}/accept_late_work', onSuccess: 'onLateWorkAccepted')

  connectModelUpdate(TaskResult, 'rejectLate', method: 'PUT', pattern: 'tasks/{id}/reject_late_work', onSuccess: 'onLateWorkRejected')

  connectModelRead(Job, 'requestJobStatus', onSuccess: 'onJobUpdate', onFail: 'onJobUpdateFailure', pattern: 'jobs/{jobId}')

  connectModelCreate(ScoresExport, 'create', onSuccess: 'onCreated', pattern: 'courses/{course.id}/performance/export')

  connectModelRead(TeacherTaskPlan, 'fetch', onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}')
  connectModelRead(TaskPlanStats, 'fetch', onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}/stats')

  connectModelRead(TaskPlanStats, 'fetchReview', onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}/review')


BOOTSTRAPED_MODELS = {
  user:     User,
  courses:  Courses,
  payments: Payments,
}

start = (bootstrapData) ->
  console.log(bootstrapData)
  for storeId, model of BOOTSTRAPED_MODELS
    data = bootstrapData[storeId]
    model.bootstrap(data)
  startAPI()

module.exports = {startAPI, start}
