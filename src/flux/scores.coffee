# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

{TimeStore} = require './time'

ACCEPTING = 'accepting'
ACCEPTED = 'accepted'

REJECTING = 'rejecting'
REJECTED = 'rejected'

TASK_ID_CACHE = {}

allStudents = (scores) ->
  _.chain(scores)
    .pluck('students')
    .flatten(true)
    .value()

computeTaskCache = (data) ->
  for courseId, period of data
    for period, periodIndex in data[courseId]
      for student, studentIndex in period.students
        for task in student.data
          TASK_ID_CACHE[task.id] = {task, courseId, period, periodIndex, studentIndex}

getTaskInfoById = (taskId, data) ->
  taskId = parseInt(taskId, 10)
  computeTaskCache(data) if _.isEmpty(TASK_ID_CACHE)
  return TASK_ID_CACHE[taskId]


adjustTaskAverages = (data, taskInfo) ->
  {task} = taskInfo
  oldScore = task.score
  course = data[taskInfo.courseId][0]
  student = course.students[taskInfo.studentIndex]

  # Calculate score for the task
  task.score = Math.round((
    (task.correct_on_time_exercise_count + task.correct_accepted_late_exercise_count ) /
      task.exercise_count
  ) * 100 ) / 100

  # Student's course average
  assignmentCount = student.data.length
  student.average_score =
    ( student.average_score - ( oldScore / assignmentCount ) ) +
      ( task.score / assignmentCount )

  # Assignment averages
  studentCount = course.students.length
  heading = course.data_headings[taskInfo.periodIndex]
  heading.average_score =
    ( heading.average_score - ( oldScore / studentCount ) ) +
      ( task.score / studentCount )

  # Overall course averages
  taskCount = 0
  for student in course.students
    taskCount += 1 for studentTask in student.data when studentTask.is_included_in_averages

  course.overall_average_score =
    (course.overall_average_score - ( oldScore / taskCount ) ) +
      ( task.score / taskCount )


ScoresConfig = {

  _asyncStatus: {}

  # clear the task id cache on load & reset
  _loaded: (obj) ->
    TASK_ID_CACHE = {}
    obj
  _reset: ->
    TASK_ID_CACHE = {}

  ######################################################################
  ## The accept / reject methods mirror Tutor-Server logic.           ##
  ## See: app/subsystems/tasks/models/task.rb                         ##
  ######################################################################

  acceptLate: (taskId) ->
    @_asyncStatus[taskId] = ACCEPTING
    taskInfo = getTaskInfoById(taskId, @_local)
    {task} = taskInfo

    # nothing to do if it's not actually late
    return unless ScoresConfig.exports.hasLateWork(task)

    task.is_late_work_accepted = true

    task.completed_accepted_late_exercise_count =
      task.completed_exercise_count - task.completed_on_time_exercise_count
    task.correct_accepted_late_exercise_count =
      task.correct_exercise_count - task.correct_on_time_exercise_count
    task.completed_accepted_late_step_count =
      task.completed_step_count - task.completed_on_time_step_count

    task.accepted_late_at = TimeStore.getNow().toISOString()

    adjustTaskAverages(@_local, taskInfo)

    @emitChange()

  acceptedLate: (unused, taskId, courseId) ->
    @_asyncStatus[taskId] = ACCEPTED
    @emitChange()

  rejectLate: (taskId) ->
    @_asyncStatus[taskId] = REJECTING
    taskInfo = getTaskInfoById(taskId, @_local)
    {task} = taskInfo
    task.is_late_work_accepted = false
    task.correct_accepted_late_exercise_count = 0
    task.completed_accepted_late_exercise_count = 0
    task.completed_accepted_late_step_count = 0
    delete task.accepted_late_at

    adjustTaskAverages(@_local, taskInfo)

    @emitChange()

  rejectedLate: (unused, taskId, courseId) ->
    @_asyncStatus[taskId] = REJECTED
    @emitChange()


  exports:

    getHumanUnacceptedScore: (task) ->
      score = Math.round((
        task.correct_on_time_exercise_count / task.exercise_count
        ) * 100 ) / 100
      "#{score * 100}%"

    getHumanScoreWithLateWork: (task) ->
      score = Math.round((
        task.correct_exercise_count / task.exercise_count
        ) * 100) / 100
      "#{score * 100}%"

    getCompletedSteps: (task) ->
      task.completed_on_time_step_count + task.completed_accepted_late_step_count

    getCompletedPercent: (task) ->
      if task.type is 'homework'
        score = task.correct_on_time_exercise_count + task.correct_accepted_late_exercise_count
        percent = Math.round( (score / task.exercise_count) * 100 )
      else
        score = task.correct_on_time_step_count + task.correct_accepted_late_step_count
        percent = Math.round( (score / task.step_count) * 100 )


    hasAdditionalLateWork: (task) ->
      task.completed_accepted_late_step_count and (
        task.completed_step_count >  task.completed_on_time_step_count +
          task.completed_accepted_late_step_count
      )

    # called by readings and homework UI to determine if there's late work
    hasLateWork: (task) ->
      ScoresConfig.exports.taskLateStepCount(task) > 0
    taskLateStepCount: (task) ->
      if task.type is 'homework'
        task.completed_exercise_count - task.completed_on_time_exercise_count +
          task.completed_accepted_late_exercise_count
      else
        task.completed_step_count - task.completed_on_time_step_count +
          task.completed_accepted_late_step_count

    getHumanProgress: (task) ->
      complete = ScoresConfig.exports.getCompletedSteps(task)
      "#{complete} of #{task.step_count}"

    getHumanDueDate: (task) ->
      task.due_at

    getHumanCompletedPercent: (task) ->
      "#{ScoresConfig.exports.getCompletedPercent(task)}%"

    getHumanTaskStatus: (task, options = {displayAs: 'number'}) ->
      if options.displayAs is 'number'
        ScoresConfig.exports.getHumanProgress(task)
      else
        ScoresConfig.exports.getHumanCompletedPercent(task)

    isTaskLate: (task) ->
      task.completed_on_time_step_count < task.completed_step_count

    getTaskInfoById: (taskId) ->
      getTaskInfoById(taskId, @_local)

    getStudent: (courseId, roleId) ->
      students = allStudents @_get(courseId)
      # TODO remove parseInt when BE fixes role to be string
      _.findWhere(allStudents(@_get(courseId)), role: parseInt(roleId))

    getAllStudents: (courseId) ->
      allStudents @_get(courseId)

    getStudentOfTask: (courseId, taskId) ->
      students = allStudents @_get(courseId)

      # TODO remove when BE fixed for ids to be strings instead of numbers
      taskId = parseInt(taskId)

      _.find students, (student) ->
        taskIds = _.pluck student.data, 'id'
        _.indexOf(taskIds, taskId) > -1

    isUpdatingLateStatus: (taskId) ->
      @_asyncStatus[taskId] is ACCEPTING or
      @_asyncStatus[taskId] is REJECTING


}

extendConfig(ScoresConfig, new CrudConfig())
{actions, store} = makeSimpleStore(ScoresConfig)
module.exports = {ScoresActions:actions, ScoresStore:store}
