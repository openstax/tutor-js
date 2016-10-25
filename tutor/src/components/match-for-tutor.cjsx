{OXMatchByRouter} = require 'shared'
InvalidPage = require './invalid-page'
Router = require '../helpers/router'

MatchForTutor = OXMatchByRouter(Router, InvalidPage)
module.exports = MatchForTutor
