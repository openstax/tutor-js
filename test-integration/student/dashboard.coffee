{describe, CourseSelect, Calendar, ReadingBuilder, CourseSelect, StudentDashboard, User} = require '../helpers'
{expect} = require 'chai'
_ = require 'underscore'


describe 'Student Dashboard', ->

  beforeEach ->
    new User(@).login('student01')
    new CourseSelect(@).goToCourseByName('Biology I')
    @dash = new StudentDashboard.Dashboard(@)

  @xit 'Has valid sub components', ->
    expect(@dash.el.progressGuide).not.to.not.be.null
    expect(@dash.el.thisWeek).not.to.not.be.null

  @it 'Can read tasks', ->
    @dash.getVisibleEventHelpers()
      .then( (events) -> Promise.all _.map events, (event) ->
        event.el.title.get().getText()
      ).then( (titles) ->
        console.log titles
        for title in titles
          expect(title).to.match(/\w+/)
        )
