_ = require 'underscore'

URL = {}
URL_SUFFIX = /_url$/

URLMethods = {

  update: (urls) ->
    for name, url of urls when name.match(URL_SUFFIX) and _.isString(url)
      URL[ name.replace(URL_SUFFIX, '') ] = url.replace(/\/$/, '')

  get: (url) ->
    URL[url]

  construct: (base, parts...) ->
    @get(base) + '/' + parts.join('/')

  reset: -> URL = {}
}

module.exports = URLMethods
