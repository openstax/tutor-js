_ = require 'underscore'

URL = {}

URLMethods = {

  update: (urls) ->
    for name, url of urls
      URL[ name.replace(/_url$/, '') ] = url

  get: (url) ->
    URL[url]

  construct: (base, parts...) ->
    @get(base) + '/' + parts.join('/')
}

module.exports = URLMethods
