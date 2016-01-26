{describe, CourseSelect, Calendar, HomeworkBuilder} = require '../helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'
NUM_EXERCISES = 4

describe 'Homework Builder', ->

  @it 'Can select exercises', ->

    @login(TEACHER_USERNAME)
    #go to course
    CourseSelect.goTo(@, 'ANY')
    Calendar.createNew(@, 'HOMEWORK')

    #select sections
    HomeworkBuilder.addSections(@)

    #select 4 exercises
    HomeworkBuilder.addExercises(@, NUM_EXERCISES)

    #verify exercises on review panel
    HomeworkBuilder.startReview(@)
    HomeworkBuilder.verifySelectedExercises(@, NUM_EXERCISES)

    HomeworkBuilder.closeBuilder(@)

  @it 'Can update tutor selections', ->
    @login(TEACHER_USERNAME)
    #go to course, create new homework, and add exercises
    CourseSelect.goTo(@, 'ANY')
    Calendar.createNew(@, 'HOMEWORK')

    HomeworkBuilder.addSections(@)
    HomeworkBuilder.addExercises(@, NUM_EXERCISES)
    HomeworkBuilder.startReview(@)

    #change amount of tutor selections
    HomeworkBuilder.verifyTutorSelection(@, 3)
    HomeworkBuilder.addTutorSelection(@)
    HomeworkBuilder.verifyTutorSelection(@, 4)
    HomeworkBuilder.removeTutorSelection(@)
    HomeworkBuilder.removeTutorSelection(@)
    HomeworkBuilder.verifyTutorSelection(@, 2)

    HomeworkBuilder.closeBuilder(@)
