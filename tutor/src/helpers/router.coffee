OXRouter = require 'shared/helpers/router'
{ getRoutes } = require '../routes'

TutorRouter = new OXRouter

TutorRouter.setRoutes(getRoutes(TutorRouter))

module.exports = TutorRouter
