{describe, CourseSelect, User, Calendar, TaskPlanBuilder} = require '../helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'
NUM_EXERCISES = 4

{CalendarHelper} =  Calendar

describe 'Homework Builder', ->

  beforeEach ->
    @title = @utils.getFreshId()
    new User(@).login(TEACHER_USERNAME)
    # Go to the 1st courses dashboard
    new CourseSelect(@).goTo('ANY')
    @calendar = new CalendarHelper(@)
    @calendar.createNew('HOMEWORK')
    @homework = new TaskPlanBuilder(@)

  @it 'Can select exercises', ->
    @homework.edit
      name: @title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3, 3.1]
      numExercises: NUM_EXERCISES

    @homework.verifySelectedExercises(NUM_EXERCISES)
    @homework.cancel()

  @it 'Can update tutor selections', ->
    @homework.edit
      name: @title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3, 3.1]
      numExercises: NUM_EXERCISES

    #change amount of tutor selections
    @homework.verifyTutorSelection(3)
    @homework.addTutorSelection()
    @homework.verifyTutorSelection(4)
    @homework.removeTutorSelection()
    @homework.removeTutorSelection()
    @homework.verifyTutorSelection(2)
    @homework.cancel()
