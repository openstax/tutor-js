# Store for getting information about the application's configuration

flux = require 'flux-react'

{makeSimpleStore} = require './helpers'

AppConfig =

  setAssetsHost: (host) ->
    @_assetsHost = host

  exports:
    getAssetsHost: ->
      return @_assetsHost if @_assetsHost?
      # http://caniuse.com/#feat=css-sel3 (substring selector is IE 9+)
      tutorStyle = document.head.querySelector('link[href*="tutor"]')
      # if we didn't find the styling css, use "/" string.
      # That'll cause the anchor test below to be a relative link and use the document's scheme/host/port
      href = if tutorStyle then tutorStyle.getAttribute('href') else "/"
      # By using this method we can easily support http, https, as well as protocol agnostic schemes
      # without using a huge nasty regex.
      # It's a bit more expensive (don't use in a loop), but we're caching the results
      a = document.createElement('a')
      a.href = href
      @_assetsHost = "#{a.protocol}//#{a.host}"

    urlForResource: (path) ->
      this.exports.getAssetsHost.call(this) + "/style/resources/#{path}"

{actions, store} = makeSimpleStore(AppConfig)
module.exports = {AppConfigActions:actions, AppConfigStore:store}
