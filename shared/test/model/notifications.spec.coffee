{Testing, expect, sinon, _} = require 'test/helpers'

URLs = require 'model/urls'
Notifications = require 'model/notifications'
Poller = require 'model/notifications/pollers'
FakeWindow = require 'test/helpers/fake-window'

describe 'Notifications', ->
  beforeEach ->
    @windowImpl = new FakeWindow
    sinon.stub(Poller.prototype, 'poll')
    sinon.spy(Poller.prototype, 'setUrl')

  afterEach ->
    Poller::poll.restore()
    Poller::setUrl.restore()
    Notifications.stopPolling()
    URLs.reset()

  it 'polls when URL is set', ->
    URLs.update(accounts_api_url: 'http://localhost:2999/api')
    Notifications.startPolling(@windowImpl)
    expect(Poller::poll).to.have.callCount(1)
    expect(Poller::setUrl.lastCall.args).to.deep.equal(['http://localhost:2999/api/user'])
    URLs.update(tutor_api_url: 'http://localhost:3001/api')
    Notifications.startPolling(@windowImpl)
    expect(Poller::poll).to.have.callCount(2)


  it 'can display and confirm manual notifications', ->
    changeListener = sinon.stub()
    notice = {message: 'hello world', icon: 'globe'}
    Notifications.on('change', changeListener)
    Notifications.display(notice)
    expect(changeListener).to.have.been.called

    active = Notifications.getActive()
    expect(active).to.have.length(1)
    # should have copied the object vs mutating it
    expect(active[0]).not.to.not.equal(notice)
    expect(active[0].type).to.exist

    Notifications.acknowledge(active[0])
    expect(changeListener).to.have.callCount(2)
    expect(Notifications.getActive()).to.be.empty
