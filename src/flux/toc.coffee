flux = require 'flux-react'

{makeSimpleStore} = require './helpers'

TocConfig =
  _toc: null
  _sections: {}

  load: ->
  loaded: (obj) ->
    @_toc = obj
    # Load all the section id's for easy lookup later.
    # They are globally unique so we do not have to worry about the course.
    for chap in obj
      for section in chap.children
        @_sections[section.id] = section

    @emitChange()

  exports:
    isLoaded: ->
      !!@_toc
    get: ->
      @_toc or throw new Error('BUG: Invalid course')
    getSectionInfo: (sectionId) ->
      @_sections[sectionId] or throw new Error('BUG: Invalid section')


{actions, store} = makeSimpleStore(TocConfig)
module.exports = {TocActions:actions, TocStore:store}
