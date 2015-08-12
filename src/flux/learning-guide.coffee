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

    # getPracticePages: (courseId) ->
    #   all = @exports.getSortedSections.call(this, courseId)
    #   count = Math.min(all.length, 4)
    #   _.chain(all).first(count).pluck('page_ids').flatten().uniq().value()


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
    this._local[id]   ||= {}
    this._local[id][roleId] = obj
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

  filterForecastedSections: (sections) ->
    _.filter(sections, (s) -> s.clue.sample_size_interpretation isnt 'below')

  weakestSections: (sections, displayCount = 4) ->
    validSections = @filterForecastedSections(sections)
    displayCount = Math.min(Math.floor(validSections.length / 2), displayCount)

    # Sort by value and pick 'displayCount' of the weakest
    _.chain(validSections)
      .sortBy((s) -> s.clue.value )
      .first(displayCount)
      .value()

  canPractice: ({sections, displayCount, minimumSectionCount}) ->
    displayCount ||= 4
    minimumSectionCount ||= 2
    @weakestSections(sections, displayCount).length >= minimumSectionCount

  pagesForSections: (sections) ->
    _.chain(sections).pluck('page_ids').flatten().uniq().value()

}


module.exports = {Student, Teacher, TeacherStudent, Helpers}
