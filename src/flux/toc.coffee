# coffeelint: disable=no_empty_functions
flux = require 'flux-react'
_ = require 'underscore'

{CrudConfig, extendConfig, makeSimpleStore} = require './helpers'

TocConfig =
  _sections: {}
  _ecosystems: {}

  FAILED: -> console.error('BUG: could not load readings')

  _reset: ->
    @_sections = {}

  _loaded: (obj, id) ->
    chapters = obj[0].children
    @_ecosystems[id] = {}
    # Load all the section id's for easy lookup later.
    # They are globally unique so we do not have to worry about the ecosystemId.
    for chap in chapters
      for section in chap.children
        @_ecosystems[id][section.uuid] = section
        @_sections[section.id] = section
    chapters

  exports:
    findWhere: (ecosystemId, query) ->
      _.findWhere(@_ecosystems[ecosystemId], query)

    getChapterSection: (sectionId) ->
      @_sections[sectionId]?.chapter_section or throw new Error('BUG: Invalid section')

    getSectionInfo: (sectionId) ->
      @_sections[sectionId] or throw new Error('BUG: Invalid section')

    getSectionLabel: (key) ->
      _.find(@_sections, (section) ->
        section.chapter_section.join('.') is key
      )

extendConfig(TocConfig, new CrudConfig())
{actions, store} = makeSimpleStore(TocConfig)
module.exports = {TocActions:actions, TocStore:store}
