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
    URLs.update(base_accounts_url: 'http://localhost:2999')
    Notifications.startPolling(@windowImpl)
    expect(Poller::poll).to.have.callCount(1)
    expect(Poller::setUrl.lastCall.args).to.deep.equal(['http://localhost:2999/api/user'])
    URLs.update(tutor_notices_url: 'http://localhost:3001/api/notifications')
    Notifications.startPolling(@windowImpl)
    expect(Poller::poll).to.have.callCount(2)
