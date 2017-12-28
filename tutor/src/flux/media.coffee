_ = require 'underscore'
htmlparser = require 'htmlparser2'
{makeSimpleStore} = require './helpers'

LINKS_BEGIN = ['#']
LINKS_CONTAIN = ['cnx.org/contents/']

MEDIA_LINK_EXCLUDES = [
  '.nav'
  '.view-reference-guide'
  '[data-type=footnote-number]'
  '[data-type=footnote-ref]'
  '[data-targeted=media]'
  '[href*=\'/\']'
  '[href=\'#\']'
]

buildAllowed = (linksBegin, linksContain) ->
  beginSelectors = _.map linksBegin, (linkString) ->
    "a[href^='#{linkString}']"

  containSelectors = _.map linksContain, (linkString) ->
    "a[href*='#{linkString}']"

  _.union(beginSelectors, containSelectors)

MediaConfig =

  _local: {}

  loaded: (id, mediaDOM) ->
    @_local[id] = mediaDOM
    @emit("loaded.#{id}", mediaDOM)

  _parseAndLoad: (actions, dom, link) ->
    if link.attribs.href.search('#') is 0
      id = link.attribs.href.replace('#', '')
      idDOM = htmlparser.DomUtils.getElementById(id, dom)
      if idDOM
        idHTML = htmlparser.DomUtils.getOuterHTML(idDOM)

        mediaDOM =
          name: idDOM.name
          html: idHTML

        actions.loaded(id, mediaDOM)

  _parseHandler: (actions, error, dom) ->
    links = htmlparser.DomUtils.getElementsByTagName('a', dom)
    _.each links, _.partial actions._parseAndLoad, actions, dom

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

    getLinksContained: ->
      LINKS_CONTAIN

    getAllowed: ->
      buildAllowed(LINKS_BEGIN, LINKS_CONTAIN)

    getExcluded: ->
      MEDIA_LINK_EXCLUDES

    getSelector: ->
      notMedias = _.reduce(MEDIA_LINK_EXCLUDES, (current, exclude) ->
        "#{current}:not(#{exclude})"
      , '')

      _.map(buildAllowed(LINKS_BEGIN, LINKS_CONTAIN), (allowed) ->
        "#{allowed}#{notMedias}"
      ).join(', ')


{actions, store} = makeSimpleStore(MediaConfig)
module.exports = {MediaActions:actions, MediaStore:store}
