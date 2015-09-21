_ = require 'underscore'
htmlparser = require 'htmlparser2'
{makeSimpleStore} = require './helpers'

MediaConfig =

  _local: {}

  loaded: (id, mediaDOM) ->
    @_local[id] = mediaDOM
    @emit("loaded.#{id}", mediaDOM)

  _parseAndLoad: (link) ->
    if link.attribs.href.search('#') is 0
      id = link.attribs.href.replace('#', '')
      idDOM = htmlparser.DomUtils.getElementById(id, dom)
      if idDOM
        idHTML = htmlparser.DomUtils.getOuterHTML(idDOM)

        mediaDOM =
          name: idDOM.name
          html: idHTML

        @loaded(id, mediaDOM)

  _parseHandler: (actions, error, dom) ->
    links = htmlparser.DomUtils.getElementsByTagName('a', dom)
    _.each(links, (link) ->
      if link.attribs.href.search('#') is 0
        id = link.attribs.href.replace('#', '')
        idDOM = htmlparser.DomUtils.getElementById(id, dom)
        if idDOM
          idHTML = htmlparser.DomUtils.getOuterHTML(idDOM)

          mediaDOM =
            name: idDOM.name
            html: idHTML

          actions.loaded(id, mediaDOM)
    )

  parse: (htmlString) ->
    @parseHandler ?= new htmlparser.DomHandler _.partial(@_parseHandler, @)
    @parser ?= new htmlparser.Parser(@parseHandler)
    @parser.parseComplete(htmlString)

  _get: (id) ->
    @_local[id]

  reset: ->
    @_local = {}
    delete @parseHandler
    delete @parser

  exports:
    get: (id) -> @_get(id)
    isLoaded: (id) -> @_get(id)?
    getMediaIds: ->
      _.keys(@_local)

{actions, store} = makeSimpleStore(MediaConfig)
module.exports = {MediaActions:actions, MediaStore:store}