{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{AppActions} = require './app'
_ = require 'lodash'

ERROR_MAP = {
  student_identifier_has_already_been_taken:
    'The provided student ID has already been used in this course. ' +
    'Please try again or contact your instructor.'
  blank_student_identifer:
    'The student ID field cannot be left blank. Please enter your student ID.'
}


StudentIdConfig = {

  _failed: (error, id) ->
    @_errors[id] = error?.data?.errors
    AppActions.resetServerErrors()
    @emit('student-id-error')

  addError: (id, error) ->
    @_errors[id] = [error]

  _saved: () ->
    @emit('student-id-saved')
    @emitChange()

  validate: (courseId, studentId) ->
    @_errors = []
    if not studentId
      @addError(courseId, code:'blank_student_identifer')

  exports:
    getErrors: (courseId) -> @_errors[courseId] or []
}

extendConfig(StudentIdConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentIdConfig)
module.exports = {StudentIdActions:actions, StudentIdStore:store, ERROR_MAP}
