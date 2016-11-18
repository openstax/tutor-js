{makeStandardStore} = require './helpers'
_ = require 'lodash'

{CourseListingActions} = require './course-listing'

DEFAULTS =
  copy_question_library: true

CONTROL_VALUES = [
  'course_type'
  'offering_id'
  'new_or_copy'
  'cloned_from_id'
]

DEPENDENT_VALUES = [
  'copy_question_library'
  'name'
  'num_sections'
]

CONTROL_RANKS = _.invert(CONTROL_VALUES)

DEPENDENT_VALUES_COMBINED = _.concat(CONTROL_VALUES, DEPENDENT_VALUES)

getChangedKeys = (oldObject, newObject) ->
  changedKeys = []
  _.forEach(oldObject, (oldValue, key) ->
    unless _.isUndefined(newObject[key]) or _.isEqual(oldValue, newObject[key])
      changedKeys.push(key)
  )
  changedKeys

getDependentKeys = (changedKeys) ->
  keyToCheck = _(changedKeys).sortBy((key) ->
      CONTROL_RANKS[key]
    ).last()

  dropIndex = _.indexOf(CONTROL_VALUES, keyToCheck)
  _.drop(DEPENDENT_VALUES_COMBINED, dropIndex + 1) unless dropIndex < 0

getChangeDependents = (oldObject, newObject) ->
  _.flow(getChangedKeys, getDependentKeys)(oldObject, newObject)

StoreDefinition = makeStandardStore('NewCourse', {
  _local: _.cloneDeep(DEFAULTS)
  # TODO Ideally, we'd use _asyncStatus to do this, but since this flux is kinda
  # non-standard -- i.e. a new course does not have a new local id -- we will do this for now.
  _isBuilding: false

  save: ->
    actions = StoreDefinition.NewCourseActions
    @_isBuilding = true
    @emitChange()
    if @_local.cloned_from_id
      actions.clone({id: @_local.cloned_from_id})
    else
      actions.create()

# used by api
# coffeelint: disable=no_empty_functions
  clone: ->
  create: ->
# coffeelint: enable=no_empty_functions
  created: (newCourse) ->
    @reset()
    @_isBuilding = false
    @_local['newlyCreatedCourse'] = newCourse
    CourseListingActions.addCourse(newCourse)
    @emitChange()
    @emit('created', newCourse)

  _reset: ->
    @_local = _.cloneDeep(DEFAULTS)

  unset: (listOfKeys) ->
    _.forEach listOfKeys, (key) =>
      if DEFAULTS[key]
        @_local[key] = DEFAULTS[key]
      else
        _.unset(@_local, key)

  set: (attrs) ->
    @unset(getChangeDependents(@_local, attrs))
    _.extend(@_local, attrs)
    @emitChange()

  setClone: (course) ->
    newCourse =
      new_or_copy: 'copy'
      course_type: if course.is_concept_coach then 'cc' else 'tutor'
      offering_id: course.offering_id
      cloned_from_id: course.id
      name: course.name
      num_sections: course.periods.length

    @set(newCourse)

  exports:
    isValid: (attr) ->
      switch attr
        when 'details' then @_local.name and @_local.num_sections
        else
          not _.isUndefined(@_local[attr])

    isBuilding: -> @_isBuilding

    newCourse: ->
      @_local['newlyCreatedCourse']

    get: (attr) ->
      @_local[attr]

    requestPayload: ->
      payload = _.omit(@_local, 'new_or_copy')
      _.extend(payload, payload.term)
      # TODO check on why this is always true...
      payload.is_college = true
      if payload.cloned_from_id
        delete payload.offering_id
      payload

})


module.exports = StoreDefinition
