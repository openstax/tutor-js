{OXLink} = require 'shared'
TutorRouter = require '../helpers/router'
TutorLink = OXLink.make(TutorRouter, 'Tutor')
TutorLink.displayName = 'TutorLink'
module.exports = TutorLink
