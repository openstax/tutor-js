_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'

CourseConfig =

  _practices: {}

  createPractice: (courseId) ->
  createdPractice: (obj, courseId) ->
    @_loadedPractice(obj, courseId) # TODO: Maybe this should emit practice.created

  _loadedPractice: (obj, courseId) ->
    obj.type ?= 'practice' # Used to filter out the practice task from the student list
    @_practices[courseId] = obj
    TaskActions.loaded(obj, obj.id)
    @emit('practice.loaded', obj.id)

  _loaded: (obj, courseId) ->
    if obj.practice
      @_loadedPractice(obj.practice, courseId)
    obj


  exports:
    getPracticeId: (courseId) ->
      @_practices[courseId]?.id

    hasPractice: (courseId) ->
      @_practices[courseId]?

    getPractice: (courseId) ->
      if @_practices[courseId]?
        {id} = @_practices[courseId]
        task = TaskStore.get(id)
      task

extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
