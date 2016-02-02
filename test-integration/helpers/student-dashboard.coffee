selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'
_ = require 'underscore'


class Event extends TestHelper

  elementRefs:
    title:
      css: '.title'
    progress:
      css: '.feedback'

  constructor: (test, eventId) ->
    super(test, ".task[data-event-id='#{eventId}']")

  @fromElement: (test, element) ->
    console.log "from el"
    element.getAttribute('data-event-id').then (el) ->
      new Event(test, el)

class Dashboard extends TestHelper

  elementRefs:
    progressGuide:
      css: '.progress-guide'
    thisWeek:
      css: '.panel.-this-week'
    visibleEvents:
      css: '.tab-pane.active .task'

  constructor: (test) ->
    super(test, '.student-dashboard')

  getVisibleEventHelpers: ->
    makeEvent = _.partial(Event.fromElement, @test)
    @el.visibleEvents.getAll().then( (tasks) ->
      Promise.all( _.map(tasks, makeEvent ) )
    )


module.exports = {Dashboard, Event}
