axios = require 'axios'

ERROR_HANDLERS = []

emitError = (resp) ->
  for handler in ERROR_HANDLERS
    try
      handler(resp)


Networking = {

  onError: (fn) -> ERROR_HANDLERS.push(fn)


  perform: (opts) ->
    axios(opts).catch(emitError)
}

module.exports = Networking
