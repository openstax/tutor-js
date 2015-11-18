# coffeelint: disable=no_empty_functions
_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
PeriodHelper = require '../helpers/period'

DEFAULT_COURSE_TIMEZONE = 'US/Central'

CourseConfig =

  _practices: {}
  _asyncStatusPractices: {}

  _isPractice: (obj) ->
    # TODO check with backend about task.type = 'practice' since task.type for homework = 'homework'
    obj.steps? # TODO: Find a more reliable way to determine if a practice is being loaded

  createPractice: (courseId, params) -> # Used by API
  createdPractice: (obj, courseId, params) ->
    obj.created_for = params
    @_loadedPractice(obj, courseId) # TODO: Maybe this should emit practice.created

  _guides: {}
  _asyncStatusGuides: {}

  loadGuide: (courseId) ->
    delete @_guides[courseId]
    @_asyncStatusGuides[courseId] = 'loading'
    @emitChange()

  loadedGuide: (obj, courseId) ->
    @_guides[courseId] = obj
    @_asyncStatusGuides[courseId] = 'loaded'
    @emitChange()

  loadPractice: (courseId) ->
    delete @_practices[courseId]
    @_asyncStatusPractices[courseId] = 'loading'
    @emitChange()

  loadedPractice: (obj, courseId) ->
    @_loadedPractice(obj, courseId)
    @_asyncStatusPractices[courseId] = 'loaded'
    @emitChange()

  _loadedPractice: (obj, courseId) ->
    obj.type ?= 'practice' # Used to filter out the practice task from the student list
    @_practices[courseId] = obj
    TaskActions.loaded(obj, obj.id)
    @emit('practice.loaded', obj.id)

  _loaded: (obj, id) ->
    @emit('course.loaded', obj.id)

  _reset: ->
    @_guides = {}
    @_asyncStatusGuides = {}
    @_practices = {}
    @_asyncStatusPractices = {}

  exports:
    getGuide: (courseId) ->
      @_guides[courseId] or throw new Error('BUG: Not loaded yet')

    isGuideLoading: (courseId) -> @_asyncStatusGuides[courseId] is 'loading'
    isGuideLoaded: (courseId) -> !! @_guides[courseId]

    isPracticeLoading: (courseId) -> @_asyncStatusPractices[courseId] is 'loading'
    isPracticeLoaded: (courseId) -> !! @_practices[courseId]

    getPracticeId: (courseId) ->
      @_practices[courseId]?.id

    getPracticePageIds: (courseId) ->
      @_practices[courseId]?.created_for?.page_ids

    hasPractice: (courseId) ->
      @_practices[courseId]?

    getPractice: (courseId) ->
      if @_practices[courseId]?
        {id} = @_practices[courseId]
        task = TaskStore.get(id)
      task

    # This is currently bassed on the course title.
    # eventually the backend will provide it as part of the course's metadata.
    getCategory: (courseId) ->
      return @_get(courseId).catalog_offering_identifier or (
        this.exports.getShortName.call(this, courseId).toLowerCase()
      )

    getShortName: (courseId) ->
      title = @_get(courseId)?.name or ""
      _.first(title.split(' '))

    getPeriods: (courseId) ->
      periods = @_get(courseId).periods or []
      sortedPeriods = PeriodHelper.sort(periods)

    getTimezone: (courseId) ->
      @_get(courseId)?.timezone or DEFAULT_COURSE_TIMEZONE

    isTeacher: (courseId) ->
      !!_.findWhere(@_get(courseId)?.roles, type: 'teacher')

    getByEcosystemId: (ecosystemId) ->
      _.findWhere(@_local, ecosystem_id: ecosystemId)


extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
