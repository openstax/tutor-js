isEmpty  = require 'lodash/isEmpty'
isString = require 'lodash/isString'



URL = {}
URL_SUFFIX = /_url$/

URLMethods = {

  update: (urls) ->
    for name, url of urls when name.match(URL_SUFFIX) and isString(url)
      URL[ name.replace(URL_SUFFIX, '') ] = url.replace(/\/$/, '')

  get: (url) ->
    URL[url]

  construct: (base, parts...) ->
    @get(base) + '/' + parts.join('/')

  hasApiHost: (key) ->
    not isEmpty(URL[key])

  reset: -> URL = {}
}

module.exports = URLMethods
