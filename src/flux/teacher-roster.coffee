# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
{CourseListingActions} = require './course-listing'
_ = require 'underscore'

DELETING = 'deleting'
DELETED = 'deleted'

TeacherRosterConfig = {

  delete: (teacherId, courseId) ->
    @_asyncStatus[teacherId] = DELETING
    @emit(DELETING)

  deleted: (result, teacherId, courseId) ->
    @_asyncStatus[teacherId] = DELETED
    CourseListingActions.delete(courseId)
    @emit(DELETED)

  exports:
    isDeleting: (teacherId) -> @_asyncStatus[teacherId] is DELETING
}

extendConfig(TeacherRosterConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherRosterConfig)
module.exports = {TeacherRosterActions:actions, TeacherRosterStore:store}
