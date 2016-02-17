{describe, CourseSelect, User, Calendar, HomeworkBuilder} = require '../helpers'
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
    @homework = new HomeworkBuilder(@)

  @it 'Can select exercises', ->
    @homework.openSelectSections()

    #select sections
    @homework.addSections()

    #select 4 exercises
    @homework.addExercises(NUM_EXERCISES)

    #verify exercises on review panel
    @homework.startReview()
    @homework.verifySelectedExercises(NUM_EXERCISES)
    @homework.closeBuilder()

  @it 'Can update tutor selections', ->
    @homework.openSelectSections()

    @homework.addSections()
    @homework.addExercises(NUM_EXERCISES)
    @homework.startReview()

    #change amount of tutor selections
    @homework.verifyTutorSelection(3)
    @homework.addTutorSelection()
    @homework.verifyTutorSelection(4)
    @homework.removeTutorSelection()
    @homework.removeTutorSelection()
    @homework.verifyTutorSelection(2)
    @homework.closeBuilder()
