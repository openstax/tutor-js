_ = require 'underscore'

SUPPORTED = document.queryCommandSupported?('copy')

module.exports = {

  isSupported: _.constant(!!SUPPORTED)

  copy: ->
    return unless SUPPORTED

    try
      document.execCommand('copy')
    catch e
      console.warn("clipboard copy failed", e)

}
