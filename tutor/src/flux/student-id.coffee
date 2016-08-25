{CrudConfig, makeSimpleStore, extendConfig, STATES} = require './helpers'
{CourseStore} = require './course'
_ = require 'lodash'

ERROR_MAP = {
  student_identifier_has_already_been_taken:
    'The provided student ID has already been used in this course. ' +
    'Please try again or contact your instructor.'
  blank_student_identifier:
    'The student ID field cannot be left blank. Please enter your student ID.'
  no_change:
    'You have not changed the student ID.  Please enter your new student ID and try again.'
}

errorIsHandled = (errors) ->
  _.reduce(errors, (error, handled) ->
    ERROR_MAP[error.code] or handled
  , false)

StudentIdConfig = {

  errored: (obj, id) ->
    {data, status, statusMessage} = obj
    @_asyncStatus[id] = STATES.LOADED
    if errorIsHandled(data.errors)
      @_errors[id] = data?.errors
      @emitChange()
      @emit('student-id-error')
    else
      @FAILED(status, statusMessage, id)

  addError: (id, error) ->
    @_errors[id] = [error]

  _saved: () ->
    @emit('student-id-saved')
    @emitChange()

  validate: (courseId, studentId) ->
    @_errors = []
    if not studentId
      @addError(courseId, code:'blank_student_identifier')
    if studentId is CourseStore.getStudentId(courseId)
      @addError(courseId, code:'no_change')


  exports:
    getErrors: (courseId) -> @_errors[courseId] or []
}

extendConfig(StudentIdConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentIdConfig)
module.exports = {StudentIdActions:actions, StudentIdStore:store, ERROR_MAP}
