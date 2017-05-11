classnames = require 'classnames'

union = require 'lodash/union'
difference = require 'lodash/difference'
map = require 'lodash/map'
compact = require 'lodash/compact'
keys = require 'lodash/keys'

module.exports =
  getBodyClasses: ->
    difference(document.body.classList or document.body.className.split(' '), keys(@_getClasses()))

  getClasses: (props, state) ->
    compact(map(@_getClasses(props, state), (value, key) ->
      key if value
    ))

  setBodyClasses: (props, state) ->
    document.body.className = classnames(union(@getBodyClasses(), @getClasses(props, state)))

  unsetBodyClasses: (props, state) ->
    document.body.className = classnames(difference(@getBodyClasses(), @getClasses(props, state)))
