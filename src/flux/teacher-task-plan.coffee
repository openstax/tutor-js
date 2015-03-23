_ = require 'underscore'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

TeacherTaskPlanConfig =

  # The load returns a JSON containing `{total_count: 0, items: [...]}`.
  # Unwrap the JSON and store the items.
  _loaded: (obj, id) ->
    {items} = obj
    @_local[id] = items

  exports:
    getCoursePlans: (id)->
        @_local[id] || []


extendConfig(TeacherTaskPlanConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TeacherTaskPlanConfig)
module.exports = {TeacherTaskPlanActions:actions, TeacherTaskPlanStore:store}
