{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{AppActions} = require './app'
_ = require 'lodash'

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

  exports:
    getErrors: (courseId) -> @_errors[courseId] or []
}

extendConfig(StudentIdConfig, new CrudConfig())
{actions, store} = makeSimpleStore(StudentIdConfig)
module.exports = {StudentIdActions:actions, StudentIdStore:store}
