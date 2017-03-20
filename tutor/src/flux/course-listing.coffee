# coffeelint: disable=no_empty_functions
_ = require 'lodash'
moment = require 'moment-timezone'
flux = require 'flux-react'

{CourseActions, CourseStore} = require './course'
{TimeStore} = require './time'

LOADING = 'loading'
LOADED  = 'loaded'
FAILED  = 'failed'
DELETING = 'deleting'
DELETED = 'deleted'

CourseListingActions = flux.createActions [
  'load'
  'loaded'
  'reset'
  'FAILED'
  'delete'
  'deleted'
  'addCourse'
]

CourseListingStore = flux.createStore
  actions: _.values(CourseListingActions)
  _asyncStatus: null
  _course_ids: []

  load: -> # Used by API
    @_asyncStatus = LOADING
    @emit('load')

  reset: ->
    @_course_ids = []
    CourseActions.reset()
    @_asyncStatus = null
    @emitChange()

  FAILED: ->
    @_asyncStatus = FAILED
    @emit('failed')

  addCourse: (newCourse) ->
    @_course_ids.push(newCourse.id)
    CourseActions.loaded(newCourse, newCourse.id)

  loaded: (courses) ->
    @_course_ids = _.map courses, (course) ->
      CourseActions.loaded(course, course.id)
      course.id # Store only the ids
    @_asyncStatus = LOADED
    @emit('loaded', courses)

  delete: (courseId) ->
    @_asyncStatus[courseId] = DELETING
    @_course_ids = _.without(@_course_ids, courseId)
    @emit(DELETING)

  deleted: (courseId) ->
    @_asyncStatus[courseId] = DELETED
    @emit(DELETED)

  exports:
    isLoading: -> @_asyncStatus is LOADING
    isLoaded:  -> @_asyncStatus is LOADED
    isFailed:  -> @_asyncStatus is FAILED

    # Loads the store if it's not already loaded or loading
    # Returns false if the store is already loaded, true otherwise
    ensureLoaded: ->
      if CourseListingStore.isLoaded()
        false
      else
        CourseListingActions.load() unless CourseListingStore.isLoading()
        true

    allCourses: ->
      return _.compact _.map @_course_ids, CourseStore.get

    allCoursesWithRoles: ->
      return _.compact _.map @_course_ids, (id) ->
        course = CourseStore.get(id)
        course if not _.isEmpty(course?.roles)

    filterTeachingCourses: (conditions) ->
      _.filter(@exports.allCoursesWithRoles.call(@), (course) ->
        _.matches(conditions)(course) and _.find(course.roles, type: 'teacher')
      )

    teachingCoursesForOffering: (offeringId) ->
      @exports.filterTeachingCourses.call(@, offering_id: offeringId)

    coursesOrderedByStatus: ->
      courses = _.sortBy(@exports.allCoursesWithRoles.call(@), 'starts_at')
      currentTime = TimeStore.getNow()

      past = []
      current = []
      future = []

      _.forEach(courses, (course) ->
        if course.ends_at? and moment(course.ends_at).isBefore(currentTime)
          past.push(course)
        # if in the future, sort into current for now
        else if course.starts_at? and moment(course.starts_at).isAfter(currentTime)
          current.push(course)
        else if not course.is_active
          past.push(course)
        else
          current.push(course)
      )

      [past, current, future]

    typeOfAllCourses: ->
      uniq = _.uniqBy(@_course_ids, (id) ->
        CourseStore.get(id).is_concept_coach
      )
      if uniq.length is 1
        if CourseStore.isConceptCoach(uniq[0]) then 'cc' else 'tutor'


    isAnyTeacher: ->
      courses = @exports.allCoursesWithRoles.call(@)
      _.some(courses, (course) ->
        _.includes(_.map(course.roles, 'type'), 'teacher')
      )

module.exports = {CourseListingActions, CourseListingStore}
