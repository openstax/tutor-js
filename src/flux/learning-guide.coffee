{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

# Unlike other stores defined in TutorJS, this contains three separate stores that have very similar capabilities.
# They're combined in one file because they're pretty lightweight and share helper methods.
# If and when any of them grow larger they could be broken out into separate files that are required and re-exported here

# Common helper method to find all the sections contained in a learning guide response
findAllSections = (section) ->
  sections = []
  if section.chapter_section?.length > 1
    sections.push(section)
  if section.children
    for child in section.children
      for section in findAllSections(child)
        sections.push(section)
  sections


# learning guide data for a teacher.
# It's loaded by the teacher and contains consolidated data for all the students in the course
Teacher = makeSimpleStore extendConfig {
  exports:
    getChaptersForPeriod: (courseId, periodId) ->
      period = _.findWhere(@_get(courseId), period_id: periodId)
      period?.children or []

    getSectionsForPeriod: (courseId, periodId) ->
      period = _.findWhere(@_get(courseId), period_id: periodId)
      findAllSections(period)

}, new CrudConfig


# learning guide data for a student.
Student = makeSimpleStore extendConfig {
  exports:
    getSortedSections: (courseId) ->
      sections = findAllSections(@_get(courseId))
      _.sortBy(sections, (s) -> s.clue.value)

    getAllSections: (courseId) ->
      findAllSections(@_get(courseId))


}, new CrudConfig


# learning guide data for a teacher's student.
# It's loaded by the teacher and contains data for an individual student in a course they're teaching
# Unlike other stores, it needs two ids; courseId & roleId.
# roleId is passed as an object so it can be set as the options property in the LoadableItem component
TeacherStudent = makeSimpleStore extendConfig {

  # modify the value that will be stored to be a object with role id's for keys
  loaded: (obj, id, {roleId}) ->
    @_asyncStatus[id] ||= {}
    @_asyncStatus[id][roleId] = 'LOADED'
    @_local[id]   ||= {}
    @_local[id][roleId] = obj
    @emitChange()

  load: (id, {roleId}) ->
    @_asyncStatus[id] ||= {}

    @_reload[id] ||= {}
    @_reload[id][roleId] = false

    @_asyncStatus[id][roleId] = 'LOADING'
    @emitChange()

  isLoading: (id, {roleId}) ->
    @_asyncStatus[id]?[roleId] is 'LOADING'

  isLoaded: (id) ->
    @_asyncStatus[id]?[roleId] is 'LOADED'

  exports:
    getSortedSections: (courseId, roleId, property = 'current_level') ->
      sections = findAllSections(@_get(courseId))
      _.sortBy(sections, property)

    get: (courseId, {roleId}) ->
      @_local[courseId]?[roleId]

    getChapters: (courseId, {roleId}) ->
      guide = @_local[courseId]?[roleId]
      guide?.children or []

    getAllSections: (courseId, {roleId}) ->
      findAllSections(@_local[courseId]?[roleId] or {})

    reload: (id, {roleId}) ->
      @_reload[id]?[roleId]

}, new CrudConfig

Helpers = {
  # Since the learning guide doesn't currently include worked dates
  # the best we can do is return from the end of the list
  recentSections: (sections, limit = 4) ->
    _.last(sections, limit)

  canDisplayForecast: (clue, sampleSizeThreshold) ->
    clue.sample_size >= sampleSizeThreshold or clue.sample_size_interpretation isnt 'below'

  filterForecastedSections: (sections, sampleSizeThreshold) ->
    _.filter(sections, (s) -> Helpers.canDisplayForecast(s.clue, sampleSizeThreshold) )

  weakestSections: (sections, sampleSizeThreshold, displayCount = 4) ->
    validSections = @filterForecastedSections(sections, sampleSizeThreshold)
    # weakestSections are only selected if there's at least two sections with forecasts
    return [] unless validSections.length >= 2
    # Select at least one, but no more than displayCount(4)
    displayCount = Math.min(
      Math.max(1, Math.floor(validSections.length / 2))
      , displayCount)

    _.chain(validSections)
      .sortBy((s) -> s.clue.value )
      .first(displayCount)
      .value()

  canPracticeWeakest: ({sections, sampleSizeThreshold, displayCount, minimumSectionCount}) ->
    displayCount ||= 4
    minimumSectionCount ||= 1
    @weakestSections(sections, displayCount).length >= minimumSectionCount

  canDisplayWeakest: ({sections, sampleSizeThreshold}) ->
    @filterForecastedSections(sections).length > 1

  pagesForSections: (sections) ->
    _.chain(sections).pluck('page_ids').flatten().uniq().value()

}


module.exports = {Student, Teacher, TeacherStudent, Helpers}
