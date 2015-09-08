_ = require 'underscore'
htmlparser = require 'htmlparser2'
{makeSimpleStore} = require './helpers'

MediaConfig =

  _local: {}

  _parseHandler: (local, error, dom) ->
    links = htmlparser.DomUtils.getElementsByTagName('a', dom)
    _.each(links, (link) ->
      if link.attribs.href.search('#') is 0
        id = link.attribs.href.replace('#', '')
        idDOM = htmlparser.DomUtils.getElementById(id, dom)
        if idDOM
          idHTML = htmlparser.DomUtils.getOuterHTML(idDOM)

          local[id] =
            name: idDOM.name
            html: idHTML
    )

  parse: (htmlString) ->
    @parseHandler ?= new htmlparser.DomHandler _.partial(@_parseHandler, @_local)
    @parser ?= new htmlparser.Parser(@parseHandler)
    @parser.parseComplete(htmlString)

  _get: (id) ->
    @_local[id]

  exports:
    get: (id) -> @_get(id)

{actions, store} = makeSimpleStore(MediaConfig)
module.exports = {MediaActions:actions, MediaStore:store}