# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
{CourseActions} = require './course'
_ = require 'underscore'

TeacherRosterConfig = {

  delete: (teacherId, courseId) ->
    @emit('deleting')

  deleted: (result, teacherId, courseId) ->
    CourseActions.load(courseId)
    @emit('deleted')
}

extendConfig(TeacherRosterConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherRosterConfig)
module.exports = {TeacherRosterActions:actions, TeacherRosterStore:store}
