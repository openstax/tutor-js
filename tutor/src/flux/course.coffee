# coffeelint: disable=no_empty_functions
_ = require 'underscore'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig, STATES} = require './helpers'
PeriodHelper = require '../helpers/period'
AppearanceCodes = require './course-appearance-codes'

DEFAULT_TIME_ZONE = 'Central Time (US & Canada)'

CourseConfig =

  _loaded: (obj, id) ->
    @emit('course.loaded', obj.id)

  _saved: (result, id) ->
    @emit('saved')

    # make sure all of course remains loaded after course gets saved to
    _.extend {}, @_local[id], result

  exports:
    getBookName: (courseId) ->
      {appearance_code} = @_local[courseId]
      AppearanceCodes[appearance_code]

    isConceptCoach: (courseId) -> !! @_local[courseId]?.is_concept_coach
    isCollege: (courseId) -> !! @_local[courseId]?.is_college
    isHighSchool: (courseId) -> not @_local[courseId]?.is_college

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

    getTimeDefaults: (courseId) ->
      _.pick(@_get(courseId), 'default_due_time', 'default_open_time')

    getTimezone: (courseId) ->
      @_get(courseId)?.time_zone or DEFAULT_TIME_ZONE

    isTeacher: (courseId) ->
      !!_.findWhere(@_get(courseId)?.roles, type: 'teacher')

    isStudent: (courseId) ->
      !!_.findWhere(@_get(courseId)?.roles, type: 'student')

    getByEcosystemId: (ecosystemId) ->
      _.findWhere(@_local, ecosystem_id: ecosystemId)

    getStudentId: (courseId) ->
      course = @_get(courseId)
      role = _.findWhere(course?.roles, type: 'student')
      if role then _.findWhere(course.students, role_id: role.id).student_identifier else null

extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
