_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CourseConfig =

  loadPractice: (courseId) ->
    @_local[courseId] ?= {}
    @_local[courseId]['practices'] ?= {}

  loadedPractice: (obj, courseId) ->
    @_local[courseId]['practices'][obj.id] = obj
    obj.type = 'practice'

    TaskActions.loaded(obj, obj.id)

  exports:
    getPracticeId: (courseId) ->
      # returns most recently loaded practice for the course if available
      if @_local[courseId]['practices']
        id = _.last(@_local[courseId]['practices'], @).id
      else
        id = null

    getPractice: (courseId) ->
      if @getPracticeId(courseId) then TaskStore.get(@getPracticeId(courseId)) else {}


extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
