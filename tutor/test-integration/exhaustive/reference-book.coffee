Helpers = require '../helpers'
{describe} = Helpers

SERVER_URL = process.env['SERVER_URL'] or 'http://localhost:3001'
TEACHER_USERNAME = 'teacher01'

SECTIONS_TO_TEST = 10

describe 'Reference Book Exercises', ->

  beforeEach ->
    new Helpers.User(@).login(TEACHER_USERNAME)
    @referenceBook = new Helpers.ReferenceBook(@)

  @it 'Loads Biology reference book with exercises (readonly)', ->

    @driver.get("#{SERVER_URL}/books/1")
    @referenceBook.open()

    for i in [1..SECTIONS_TO_TEST]

      @driver.getCurrentUrl().then (pageUrl) ->
        console.log('Testing page', pageUrl)

      @referenceBook.checkExercisesOnPage()
        .then @referenceBook.logExercises

      @referenceBook.goNext()

  @it 'Loads Physics reference book with exercises (readonly)', ->

    @driver.get("#{SERVER_URL}/books/3")
    @referenceBook.open()

    for i in [1..SECTIONS_TO_TEST]

      @driver.getCurrentUrl().then (pageUrl) ->
        console.log('Testing page', pageUrl)

      @referenceBook.checkExercisesOnPage()
        .then @referenceBook.logExercises

      @referenceBook.goNext()
