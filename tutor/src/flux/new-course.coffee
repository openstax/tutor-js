{makeStandardStore} = require './helpers'
extend = require 'lodash/extend'

{CourseListingActions} = require './course-listing'

StoreDefinition = makeStandardStore('NewCourse', {

  save: ->
    actions = StoreDefinition.NewCourseActions
    if @_local.source_course_id
      actions.clone({courseId: @_local.source_course_id})
    else
      actions.create()

# used by api
# coffeelint: disable=no_empty_functions
  clone: ->
  create: ->
# coffeelint: enable=no_empty_functions
  created: (newCourse) ->
    CourseListingActions.addCourse(newCourse)
    @reset()
    @_local['newlyCreatedCourse'] = newCourse
    @emit('created', newCourse)

  set: (attrs) ->
    extend(@_local, attrs)
    @emitChange()

  exports:
    isValid: (attr) ->
      !! switch attr
        when 'details' then @_local.name and @_local.number_of_sections
        else
          @_local[attr]

    newCourse: ->
      @_local['newlyCreatedCourse']

    get: (attr) ->
      @_local[attr]

    requestPayload: ->
      @_local

})


module.exports = StoreDefinition
