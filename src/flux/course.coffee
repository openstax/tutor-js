# coffeelint: disable=no_empty_functions
_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
PeriodHelper = require '../helpers/period'

DEFAULT_TIME_ZONE = 'Central Time (US & Canada)'

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

  _saved: (result, id) ->
    @emit('saved')

    # make sure all of course remains loaded after course gets saved to
    _.extend {}, @_local[id], result

  exports:
    getGuide: (courseId) ->
      @_guides[courseId] or throw new Error('BUG: Not loaded yet')

    isConceptCoach: (courseId) -> !! @_local[courseId]?.is_concept_coach
    isCollege: (courseId) -> !! @_local[courseId]?.is_college

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

    validateCourseName: (name, courses, active) ->
      for course in courses
        if course.name is name
          return['courseNameExists'] unless name is active
        if not name? or name is ''
          return ['required']

    # Returns the configured appearance code for a course
    getAppearanceCode: (courseId) ->
      return @_get(courseId)?.appearance_code or 'default'

    getName: (courseId) ->
      @_get(courseId)?.name or ""

    getPeriods: (courseId, options = {includeArchived: false}) ->
      course = @_get(courseId)
      periods = if options.includeArchived then course.periods else PeriodHelper.activePeriods(course)
      sortedPeriods = if periods then PeriodHelper.sort(periods) else []

    getTimezone: (courseId) ->
      @_get(courseId)?.time_zone or DEFAULT_TIME_ZONE

    getDefaultTimes: (courseId, periodId) ->
      course = @_get(courseId)

      if periodId?
        tasking = _.findWhere(course.periods, id: periodId)
      else
        tasking = course

      _.pick tasking, 'default_open_time', 'default_due_time'

    isTeacher: (courseId) ->
      !!_.findWhere(@_get(courseId)?.roles, type: 'teacher')

    getByEcosystemId: (ecosystemId) ->
      _.findWhere(@_local, ecosystem_id: ecosystemId)


extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
