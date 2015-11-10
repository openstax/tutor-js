# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
_ = require 'underscore'

DELETING = 'deleting'
DELETED = 'deleted'

TeacherRosterConfig = {

  delete: (teacherId) ->
    @_asyncStatus[teacherId] = DELETING
    @emit(DELETING)

  deleted: (result, teacherId) ->
    @emit(DELETED)

  exports:
    isDeleting: (teacherId) -> @_asyncStatus[teacherId] is DELETING
}

extendConfig(TeacherRosterConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherRosterConfig)
module.exports = {TeacherRosterActions:actions, TeacherRosterStore:store}
