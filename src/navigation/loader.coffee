_ = require 'underscore'
interpolate = require 'interpolate'

makeViewSettings = (viewOptions, routePattern, view) ->
  viewOptions = _.extend({}, viewOptions, {view})
  route = interpolate(routePattern, viewOptions)

  {state: {view}, route}

loader = (model, viewSettings) ->
  viewOptions = _.pick(model, 'prefix', 'base')
  model.views = _.mapObject viewSettings, _.partial(makeViewSettings, viewOptions)

module.exports = {loader}
