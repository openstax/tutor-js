_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TeacherTaskPlanConfig =
  exports:
    getCoursePlans: (id)->
        @_local[id] || []


extendConfig(TeacherTaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherTaskPlanConfig)
module.exports = {TeacherTaskPlanActions:actions, TeacherTaskPlanStore:store}
