{makeStandardStore} = require './helpers'
extend = require 'lodash/extend'
cloneDeep  = require 'lodash/cloneDeep'

{CourseListingActions} = require './course-listing'

DEFAULTS =
  copy_question_library: true

StoreDefinition = makeStandardStore('NewCourse', {
  _local: cloneDeep(DEFAULTS)

  save: ->
    actions = StoreDefinition.NewCourseActions
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
    @_local['newlyCreatedCourse'] = newCourse
    CourseListingActions.addCourse(newCourse)
    @emit('created', newCourse)

  _reset: ->
    @_local = cloneDeep(DEFAULTS)

  set: (attrs) ->
    extend(@_local, attrs)
    @emitChange()

  setClone: (course) ->
    newCourse =
      course_type: if course.is_concept_coach then 'cc' else 'tutor'
      offering_id: course.offering_id
      cloned_from_id: course.id
      name: course.name
      num_sections: course.periods.length

    @set(newCourse)

  exports:
    isValid: (attr) ->
      !! switch attr
        when 'details' then @_local.name and @_local.num_sections
        else
          @_local[attr]

    newCourse: ->
      @_local['newlyCreatedCourse']

    get: (attr) ->
      @_local[attr]

    requestPayload: ->
      payload = cloneDeep(@_local)
      extend(payload, payload.term)
      # TODO check on why this is always true...
      payload.is_college = true
      if payload.cloned_from_id
        delete payload.offering_id
      payload

})


module.exports = StoreDefinition
