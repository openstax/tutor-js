{Testing, expect, sinon, _} = require '../helpers/component-testing'

Notifications = require 'components/notifications'
URLs = require 'model/urls'
NotificationsModel = require 'model/notifications'
Poller = require 'model/notifications/pollers'

describe 'Notifications Bar', ->
  beforeEach ->
    URLs.update(
      accounts_user_url:    'http://localhost:2999/api/user'
      tutor_notices_url:    'http://localhost:3001/api/notifications'
    )

    @windowImpl =
      setInterval: sinon.spy()
      localStorage:
        getItem: sinon.stub().returns('[]')
        setItem: sinon.stub()
      document:
        hidden: false
    Notifications.startPolling(window: @windowImpl)

    sinon.stub(Poller.prototype, 'poll')

    # NotificationActions.startPolling(@windowImpl)
    # NotificationActions.loadedUpdates(TEST_NOTICES)

  afterEach ->
    Poller::poll.restore()

  it 'polls', ->
    expect(Poller::poll).to.have.callCount(1) #been.called()
    # NotificationActions.loadedUpdates([])
    # Testing.renderComponent( NotificationsBar ).then ({dom}) ->
    #   expect(dom).to.be.null

  # it 'renders active notices', ->
  #   Testing.renderComponent( NotificationsBar ).then ({dom}) ->
  #     expect(dom.textContent).to.contain(TEST_NOTICES[0].message)

  # it 'remembers notice as ignored when dismiss is clicked', ->
  #   Testing.renderComponent( NotificationsBar ).then ({dom}) =>
  #     Testing.actions.click(dom.querySelector('.dismiss'))
  #     expect(@windowImpl.localStorage.setItem).to.have.been.calledWith('ox-notifications', '["1"]')
