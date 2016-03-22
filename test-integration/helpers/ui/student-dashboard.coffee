selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'
_ = require 'underscore'


class Event extends TestHelper

  elementRefs: ->
    locator = @el.self().getLocator().css or ''
    title:
      css: "#{locator} .title"
    progress:
      css: "#{locator} .feedback"

  constructor: (test, eventId) ->
    super(test, css: ".task[data-event-id='#{eventId}']")

  @fromElement: (test, element) ->
    element.getAttribute('data-event-id').then (eventId) ->
      new Event(test, eventId)

  isMatchFor: (query) ->
    queryName = _.first _.keys query
    if @el[queryName]
      @el[queryName].get().getText().then( (txt) =>
        if query[queryName] is txt then @ else null
      )
    else
      selenium.promise.fulfilled(null)


class StudentDashboard extends TestHelper

  @Event: Event

  elementRefs:
    progressGuide:
      css: '.progress-guide'
    thisWeek:
      css: '.panel.-this-week'
    visibleEvents:
      css: '.tab-pane.active .task'
    workableTask:
      css: '.tab-pane.active .workable.task'

  constructor: (test) ->
    super(test, css: '.student-dashboard')

  findVisibleEvents: (options = {}) ->
    @test.utils.wait.giveTime @options.defaultWaitTime, =>
      return @el.visibleEvents.getAll() if _.isEmpty(options.where)
      makeEvent = _.partial(Event.fromElement, @test)
      @el.visibleEvents.getAll().then( (tasks) ->
        selenium.promise.map( tasks, makeEvent )
      ).then( (events) ->
        selenium.promise.map(events, (event) ->
          event.isMatchFor(options.where))
          .then( (events) ->
            _.pluck( _.compact(events), 'element' )
          )
      )

  # showPastWork()
  # showCurrentWork()
  # goToPracticeByIndex(index)
  # goToPracticeBySection('4.3')
  # goToPracticeWeakest()
  # goToForecast()
  # goToBook()
  #
  # goToAssignmentByIndexe(index)
  #
  # goToAssignmentByType(assignmentType)
  # goToAssignmentByTitle(title)

module.exports = StudentDashboard
