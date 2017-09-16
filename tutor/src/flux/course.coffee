capitalize  = require 'lodash/capitalize'
extend  = require 'lodash/extend'
find    = require 'lodash/find'
values  = require 'lodash/values'
pick    = require 'lodash/pick'
isEmpty = require 'lodash/isEmpty'

{TaskActions, TaskStore} = require './task'
{CrudConfig, makeSimpleStore, extendConfig, STATES} = require './helpers'
{default: PeriodHelper} = require '../helpers/period'
{default:CourseInformation} = require '../models/course/information'

DEFAULT_TIME_ZONE = 'Central Time (US & Canada)'

CourseConfig =

  _loaded: (obj, id) ->
    @emit('course.loaded', obj.id)

  _saved: (result, id) ->
    @emit('saved', result)

    # make sure all of course remains loaded after course gets saved to
    extend {}, @_local[id], result


  exports:
    getBookName: (courseId) ->
      {appearance_code} = @_local[courseId]
      CourseInformation.forAppearanceCode(appearance_code)?.title or ''

    getBookUUID: (courseId) ->
      @_local[courseId]?.ecosystem_book_uuid

    getSubject: (courseId) ->
      {appearance_code} = @_local[courseId]
      CourseInformation.forAppearanceCode(appearance_code)?.subject or ''

    isConceptCoach: (courseId) -> !! @_local[courseId]?.is_concept_coach
    isCollege: (courseId) -> !! @_local[courseId]?.is_college
    isHighSchool: (courseId) -> not @_local[courseId]?.is_college

    validateCourseName: (name, courses, active) ->
      for course in courses
        if course.name is name
          return ['courseNameExists'] unless name is active
        if not name? or name is ''
          return ['required']

    # Returns the configured appearance code for a course
    getAppearanceCode: (courseId) ->
      return @_get(courseId)?.appearance_code or 'default'

    getName: (courseId) ->
      @_get(courseId)?.name or ""

    getTerm: (courseId) ->
      course = @_get(courseId)
      capitalize("#{course?.term} #{course?.year}") if course

    getPeriods: (courseId, options = {includeArchived: false}) ->
      course = @_get(courseId)
      periods = if options.includeArchived then course.periods else PeriodHelper.activePeriods(course)
      sortedPeriods = if periods then PeriodHelper.sort(periods) else []

    getTimeDefaults: (courseId) ->
      pick(@_get(courseId), 'default_due_time', 'default_open_time')

    getTimezone: (courseId) ->
      @_get(courseId)?.time_zone or DEFAULT_TIME_ZONE

    isTeacher: (courseId) ->
      !!find(@_get(courseId)?.roles, type: 'teacher')

    isStudent: (courseId) ->
      !!find(@_get(courseId)?.roles, type: 'student')

    getByEcosystemId: (ecosystemId) ->
      find(values(@_local), ecosystem_id: ecosystemId)

    getStudentId: (courseId) ->
      course = @_get(courseId)
      role = find(course?.roles, type: 'student')
      if role then find(course.students, role_id: role.id).student_identifier else null

    isCloned: (courseId) ->
      !!@_get(courseId)?.cloned_from_id

extendConfig(CourseConfig, new CrudConfig())
{actions, store} = makeSimpleStore(CourseConfig)
module.exports = {CourseActions:actions, CourseStore:store}
