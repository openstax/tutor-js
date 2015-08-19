# coffeelint: disable=no_empty_functions
flux = require 'flux-react'
_ = require 'underscore'

{CrudConfig, extendConfig, makeSimpleStore} = require './helpers'

TocConfig =
  _toc: null
  _sections: {}

  FAILED: -> console.error('BUG: could not load readings')

  reset: ->
    @_toc = null
    @_sections = {}

  load: (courseId) -> # used by API
  loaded: (obj) ->
    @_toc = obj
    chapters = obj[0].children
    # Load all the section id's for easy lookup later.
    # They are globally unique so we do not have to worry about the course.
    for chap in chapters
      for section in chap.children
        @_sections[section.id] = section

    @emitChange()

  exports:
    isLoaded: ->
      !!@_toc
    get: ->
      if @_toc?.length
        @_toc[0].children

    getChapterSection: (sectionId) ->
      if (@_toc and @_sections and @_sections[sectionId])
        @_sections[sectionId].chapter_section
      else
        throw new Error('BUG: Invalid section')

    getSectionInfo: (sectionId) ->
      console.info('sectionId')
      console.info(sectionId)
      if (@_toc and @_sections)
        @_sections[sectionId] or throw new Error('BUG: Invalid section')
    getSectionLabel: (key) ->
      _.find(@_sections, (section) ->
        section.chapter_section.toString() is key
      )

extendConfig(TocConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TocConfig)
module.exports = {TocActions:actions, TocStore:store}
