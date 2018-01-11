OXRouter = require 'shared/src/helpers/router'
{default:routes} = require '../routes'
TutorRouter = new OXRouter(routes)

module.exports = TutorRouter
