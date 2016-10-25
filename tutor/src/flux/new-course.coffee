{makeStandardStore} = require './helpers'


module.exports = makeStandardStore('NewCourse', {

  set: (attrs) ->
    _.extend(@_local, attrs)
    @emitChange()

  exports:
    isValid: (attr) ->
      !! switch attr
        when 'details' then @_local.course_name and @_local.number_of_sections
        else
          @_local[attr]


    get: (attr) ->
      @_local[attr]

})
