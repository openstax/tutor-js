_ = require 'underscore'

URL = {}

URLMethods = {

  update: (urls) ->
    for name, url of urls
      URL[ name.replace(/_url$/, '') ] = url.replace(/\/$/, '')

  get: (url) ->
    URL[url]

  construct: (base, parts...) ->
    @get(base) + '/' + parts.join('/')

  reset: -> URL = {}
}

module.exports = URLMethods
