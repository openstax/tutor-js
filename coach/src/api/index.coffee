EventEmitter2 = require 'eventemitter2'

createHandler = require './create-handler'
routes = require './routes'

coachAPIHandler = null

# HACK - WORKAROUND
# MediaBodyView.prototype.initializeConceptCoach calls this multiple times
# (triggered by back-button and most perhaps search)
IS_INITIALIZED = false

initialize = (baseUrl) ->
  coachAPIHandler = createHandler(baseUrl, routes) unless IS_INITIALIZED
  IS_INITIALIZED = true

  # export coach api handler things for each access
  module.exports.isPending = coachAPIHandler.records.isPending
  module.exports.channel = coachAPIHandler.channel

destroy = ->
  coachAPIHandler.destroy()
  IS_INITIALIZED = false

module.exports = {initialize, destroy}
