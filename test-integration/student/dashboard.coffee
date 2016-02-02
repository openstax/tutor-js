{describe, CourseSelect, Calendar, ReadingBuilder, CourseSelect, StudentDashboard, User} = require '../helpers'
selenium = require 'selenium-webdriver'
{expect} = require 'chai'
_ = require 'underscore'


describe 'Student Dashboard', ->

  beforeEach ->
    @student = new User(@)
    @student.login('student01')
    @courseSelect = new CourseSelect(@)
    @courseSelect.goToCourseByName('Biology I')
    @dash = new StudentDashboard.Dashboard(@)

  @it 'Has valid sub components', ->
    expect(@dash.el.progressGuide).not.to.not.be.null
    expect(@dash.el.thisWeek).not.to.not.be.null

  @it 'Can read tasks', ->
    @dash.getVisibleEventHelpers()
      .then( (events) -> selenium.promise.map events, (event) ->
        event.el.title.get().getText()
      ).then (titles) ->
        for title in titles
          expect(title).to.match(/\w+/)


  @it 'displays tasks that are assigned', ->

    # Reading builder is busted? Multiple time outs on edit/publish action

    # title = @utils.getFreshId()
    # @student.logout()
    # teacher = new User(@)
    # teacher.login('teacher01')
    # @courseSelect.goToCourseByName('Biology I')
    # calendar = new Calendar.CalendarHelper(@)
    # calendar.createNew('READING')
    # reading = new ReadingBuilder(@)


    # reading.edit
    #   name: title
    #   opensAt: 'NOT_TODAY'
    #   dueAt: 'EARLIEST'
    #   sections: [1.2]
    #   action: 'PUBLISH'

    # teacher.logout()

    # @student.login('student02')
    # @courseSelect.goToCourseByName('Biology I')
    title = 'Read Chapter 1. The Study of Life'

    @dash.getVisibleEventHelpers(where: {title: title}).then (events) ->
      expect(events.length).to.equal(1)
      event = _.first events
      expect(event).not.to.be.null
      expect(event).to.be.an.instanceof(StudentDashboard.Event)
      event.el.title.get().getText().then (eventTitle) ->
        expect(eventTitle).to.equal(title)
      event.el.progress.get().getText().then (progress) ->
        expect(progress).to.equal('Not started')
    @logout()
