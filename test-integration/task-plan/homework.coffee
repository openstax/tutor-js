Helpers = require '../helpers'
{describe} = Helpers

{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'
NUM_EXERCISES = 4

describe 'Assignment Publishing Tests', ->

  beforeEach ->
    @calendar = new Helpers.Calendar(@)
    @title = @utils.getFreshId()
    new Helpers.User(@).login(TEACHER_USERNAME)
    # Go to the 1st courses dashboard
    new Helpers.CourseSelect(@).goToByType('BIOLOGY')
    @calendar.waitUntilLoaded()
    @calendar.createNew('HOMEWORK')
    @homework = new Helpers.TaskBuilder(@)

  @it 'Can update tutor selections', ->
    @homework.edit
      name: @title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3, 3.1]
      numExercises: NUM_EXERCISES

    #change amount of tutor selections
    @homework.countTutorSelection().then (value) ->
      expect(value).to.equal(3)

    @homework.addTutorSelection()
    @homework.countTutorSelection().then (value) ->
      expect(value).to.equal(4)
    @homework.removeTutorSelection()
    @homework.removeTutorSelection()
    @homework.countTutorSelection().then (value) ->
      expect(value).to.equal(2)

    @homework.edit(action: 'CANCEL')

  @it 'Can select exercises', ->
    @homework.edit
      name: @title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3, 3.1]
      numExercises: NUM_EXERCISES

    @homework.countSelectedExercises().then (value) ->
      expect(value).to.equal(NUM_EXERCISES)
    @homework.edit(action: 'CANCEL')

  @it 'Sets the feedback status of a homework', ->
    @homework.isFeedbackImmediate().then (value) ->
      expect(value).to.equal(false)
    @homework.setFeedbackImmediate(true)
    @homework.isFeedbackImmediate().then (value) ->
      expect(value).to.equal(true)
    @homework.edit(action: 'CANCEL')


