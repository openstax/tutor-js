{OXMatchByRouter} = require 'shared'
Router = require '../helpers/router'
InvalidPage = require('./invalid-page').default

MatchForTutor = OXMatchByRouter(Router, InvalidPage, 'TutorRouterMatch')
module.exports = MatchForTutor
