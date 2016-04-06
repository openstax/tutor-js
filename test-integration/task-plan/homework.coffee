Helpers = require '../helpers'
{describe} = Helpers

{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

describe 'Assignment Publishing Tests', ->

  beforeEach ->
    @calendar = new Helpers.Calendar(@)
    @calendarPopup = new Helpers.Calendar.Popup(@)
    @homework = new Helpers.TaskBuilder(@)

    @title = @utils.getFreshId()
    new Helpers.User(@).login(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    new Helpers.CourseSelect(@).goToByType('ANY')
    @calendar.waitUntilLoaded()

    @calendar.createNew('HOMEWORK')

  @it 'Sets the feedback status of a homework', ->
    @homework.isFeedbackImmediate().then (value) ->
      expect(value).to.equal(false)
    @homework.setFeedbackImmediate(true)
    @homework.isFeedbackImmediate().then (value) ->
      expect(value).to.equal(true)
