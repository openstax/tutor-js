
User = require '../models/user'
Courses = require '../models/course'

loadSidebar = () ->

startHypothesis = (authority, embedUrl, clientId) ->
  console.log('Starting Hypothesis ...')


start = (hypothesisData) ->
    console.log(hypothesisData)
    apiUrl = hypothesisData['api_url']
    authority = hypothesisData['authority']
    clientId = hypothesisData['client_id']
    embedUrl = hypothesisData['embed_url']
    clientUrl = hypothesisData['client_url']
    sidebarAppUrl = hypothesisData['sidebar_app_url']

    if !!find(Courses.active, { appearance_code: 'college_biology'})
        startHypothesis(authority, embedUrl, clientId)

module.exports = {startHypothesis, start}
