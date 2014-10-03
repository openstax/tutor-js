# This modifies `react-router`'s `AsyncState` to handle rejected promises
# Originally at https://github.com/rackt/react-router/blob/master/modules/utils/resolveAsyncState.js
Promise = require 'when/lib/Promise'
{AsyncState} = require 'react-router'


###
Resolves all values in asyncState and calls the setState
function with new state as they resolve. Returns a promise
that resolves after all values are resolved.
###
resolveAsyncState = (asyncState, setState) ->
  return Promise.resolve()  unless asyncState?
  keys = Object.keys(asyncState)
  Promise.all keys.map (key) ->
    resolved = (value) ->
      newState = {}
      newState[key] = value
      setState(newState)
      return

    rejected = (err) ->
      newState = {}
      newState["#{key}_error"] = err
      setState(newState)
      return

    Promise.resolve(asyncState[key]).then(resolved, rejected)



AsyncState.componentDidMount = ->
  return if @props.initialAsyncState or typeof @constructor.getInitialAsyncState isnt 'function'

  resolveAsyncState(@constructor.getInitialAsyncState(@props.params, @props.query, @updateAsyncState), @updateAsyncState)

module.exports = AsyncState
