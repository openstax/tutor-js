{UiSettings} = require 'shared'

jest.mock('../../../src/helpers/router', ->
  { currentQuery: jest.fn(-> {}) }
)
Router = require '../../../src/helpers/router'

Helper = require '../../../src/screens/teacher-dashboard/helper'
jest.useFakeTimers()

describe 'CourseCalendar Helper', ->
  courseId = 99
  beforeEach ->
    UiSettings._reset()

  it 'detects if sidebar should show intro', ->
    expect(Helper.shouldIntro()).to.be.false
    Router.currentQuery.mockReturnValueOnce({showIntro: 'true'})
    expect(Helper.shouldIntro()).to.be.true
    undefined

  it 'stores sidebar state in settings', ->
    expect(Helper.isSidebarOpen(courseId)).to.be.false
    Helper.setSidebarOpen(courseId, true)
    expect(Helper.isSidebarOpen(courseId)).to.be.true
    undefined

  xit 'will schedule intro callbacks', ->
    Router.currentQuery.mockReturnValueOnce({showIntro: 'true'})
    cbSpy = sinon.spy()
    Helper.scheduleIntroEvent(cbSpy, 1, 2, 3)
    expect(cbSpy).not.to.have.been.called
    jest.runAllTimers()
    expect(cbSpy).to.have.been.calledWith(1, 2, 3)
    undefined
