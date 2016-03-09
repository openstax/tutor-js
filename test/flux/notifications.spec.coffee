_ = require 'underscore'

{NotificationActions, NotificationStore} = require '../../src/flux/notifications'

TEST_NOTICES = require '../../api/notifications'

describe 'Notifications store', ->

  beforeEach ->
    @windowImpl =
      setInterval: sinon.spy()
      localStorage:
        getItem: sinon.stub().returns('[]')
        setItem: sinon.stub()
      document:
        hidden: false
    sinon.stub(NotificationActions, 'loadUpdates')
    NotificationActions.startPolling(@windowImpl)
    NotificationActions.loadedUpdates(TEST_NOTICES)

  afterEach ->
    NotificationActions.loadUpdates.restore()

  it 'polls for updates when started', ->
    expect(@windowImpl.setInterval).to.have.been.calledWith(NotificationActions.pollForUpdate, 300000)

  it 'remembers notices when they are dismissed', ->
    expect(NotificationStore.getActiveNotifications()).to.deep.equal(TEST_NOTICES)
    NotificationActions.acknowledge(TEST_NOTICES[0].id)
    expect(@windowImpl.localStorage.setItem).to.have.been.calledWith('ox-notifications', '["1"]')

  it 'does not list items that are ignored', ->
    @windowImpl.localStorage.getItem.returns('["2"]')
    NotificationActions.loadedUpdates(TEST_NOTICES)
    expect(NotificationStore.getActiveNotifications()).to.deep.equal([ TEST_NOTICES[0] ])

  it 'does not poll when document.hidden is true', ->
    # called once in beforeEach when polling starts
    expect(NotificationActions.loadUpdates.callCount).to.equal(1)
    @windowImpl.document.hidden = true
    NotificationActions.startPolling(@windowImpl)
    NotificationActions.pollForUpdate()
    # should not have called loadUpdates since document is hidden
    expect(NotificationActions.loadUpdates.callCount).to.equal(1)

  it 'removes outdated ids from localstorage', (done) ->
    # mock that we've observed the current notices
    @windowImpl.localStorage.getItem.returns('["1", "2"]')
    NotificationActions.startPolling(@windowImpl)
    expect(@windowImpl.localStorage.setItem).not.to.have.been.called

    # load a new set of messages that do not include the previous ones
    NotificationActions.loadedUpdates([{id: '3', message: 'message three'}])

    # 1 and 2 are removed
    expect(@windowImpl.localStorage.setItem).to.have.been.calledWith('ox-notifications', '[]')
    done()
