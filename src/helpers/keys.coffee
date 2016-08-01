_ = require 'underscore'
keymaster = require 'keymaster'

keysHelper = {}

handleKeys = (keyFN, keys, keymasterArgs...) ->
  return keys? unless keys
  # cover for some annoying keymaster bugs
  if _.isArray(keys)
    _.each(keys, (key) ->
      keyFN key.toString(), keymasterArgs...
    )
  else
    keyFN keys, keymasterArgs...

keysHelper.on = _.partial(handleKeys, keymaster)

keysHelper.off = _.partial(handleKeys, keymaster.unbind)

keysHelper.getCharFromNumKey = (numKey, offset = 1) ->
  String.fromCharCode((97 - offset) + numKey)

module.exports = keysHelper
