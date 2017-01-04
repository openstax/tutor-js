{Testing, expect, sinon, _} = require 'shared/specs/helpers'
moment = require 'moment'
URLs = require 'model/urls'
Notifications = require 'model/notifications'
Poller = require 'model/notifications/pollers'
FakeWindow = require 'shared/specs/helpers/fake-window'

describe 'Notifications', ->
  beforeEach ->
    @windowImpl = new FakeWindow
    sinon.stub(Poller.prototype, 'poll')
    sinon.spy(Poller.prototype, 'setUrl')

  afterEach ->
    Poller::poll.restore()
    Poller::setUrl.restore()
    Notifications._reset()
    URLs.reset()

  it 'polls when URL is set', ->
    URLs.update(accounts_api_url: 'http://localhost:2999/api')
    Notifications.startPolling(@windowImpl)
    expect(Poller::poll).to.have.callCount(1)
    expect(Poller::setUrl.lastCall.args).to.deep.equal(['http://localhost:2999/api/user'])
    URLs.update(tutor_api_url: 'http://localhost:3001/api')
    Notifications.startPolling(@windowImpl)
    expect(Poller::poll).to.have.callCount(2)
    undefined


  it 'can display and confirm manual notifications', ->
    changeListener = sinon.stub()
    notice = {message: 'hello world', icon: 'globe'}
    Notifications.on('change', changeListener)
    Notifications.display(notice)
    expect(changeListener).to.have.been.called

    active = Notifications.getActive()[0]
    expect(active).to.exist
    # should have copied the object vs mutating it
    expect(active).not.to.not.equal(notice)
    expect(active.type).to.exist

    Notifications.acknowledge(active)
    expect(changeListener).to.have.callCount(2)
    expect(Notifications.getActive()).to.be.empty
    undefined

  it 'adds missing student id when course role is set', ->
    changeListener = sinon.stub()
    notice = {message: 'hello world', icon: 'globe'}
    Notifications.once('change', changeListener)
    course = {id: '1', ends_at: moment().add(1, 'day'), students: [{role_id: '111'}] }
    role = {id: '111', type: 'student', joined_at: '2016-01-30T01:15:43.807Z' }
    Notifications.setCourseRole(course, role)
    expect(changeListener).to.have.been.called
    active = Notifications.getActive()[0]
    expect(active.type).to.equal('missing_student_id')
    expect(active.course).to.deep.equal(course)
    expect(active.role).to.deep.equal(role)
    undefined

  it 'adds course has ended when course role is set', ->
    changeListener = sinon.stub()
    notice = {message: 'hello world', icon: 'globe'}
    Notifications.once('change', changeListener)
    course = {id: '1', students: [{role_id: '111'}], ends_at: '2011-11-11T01:15:43.807Z'}
    Notifications.setCourseRole(course, {id: '111'})
    expect(changeListener).to.have.been.called
    active = Notifications.getActive()[0]
    expect(active.type).to.equal('course_has_ended')
    undefined

  it 'prevents duplicates from being displayed', ->
    notice = {id: '1', type: 'status'}
    Notifications.display(notice)
    Notifications.display(notice)
    expect(Notifications.getActive()).to.deep.eq([notice])
    undefined
