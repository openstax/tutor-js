# The AppConfig store is intended as a place for storing/retrieving information about the
# application's configuration.

flux = require 'flux-react'
{makeSimpleStore} = require './helpers'

AppConfig =

  setAssetsPrefix: (prefix) ->
    @_assetsPrefix = prefix

  exports:
    getAssetsPrefix: ->
      return @_assetsPrefix if @_assetsPrefix?
      # http://caniuse.com/#feat=css-sel3 (substring selector is IE 9+)
      tutorStyle = document.head.querySelector('link[href*="tutor"]')
      # if we didn't find the styling css, use "/" string.
      href = if tutorStyle then tutorStyle.getAttribute('href') else "/"
      @_assetsPrefix = href[0..href.lastIndexOf('/')]

    urlForResource: (path) ->
      # In development the css is served from the 'dist' directory, but the images are not
      # In production everythings under "assets" and works fine
      prefix = this.exports.getAssetsPrefix.call(this)
      "#{prefix}#{path}"


{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppConfigActions:actions, AppConfigStore:store}
