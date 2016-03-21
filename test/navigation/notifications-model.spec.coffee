Notifications = require 'navigation/notifications-model'

TEST_NOTICES = require '../../api/notifications/GET'

describe 'Notifications Model', ->

  beforeEach ->
    @windowImpl =
      setInterval: sinon.spy()
      localStorage:
        getItem: sinon.stub().returns('[]')
        setItem: sinon.stub()
      document:
        hidden: false
      clearInterval: sinon.spy()
    Notifications.init(@windowImpl)
    Notifications.loaded(data: TEST_NOTICES)

  afterEach ->
    Notifications.destroy(@windowImpl)

  it 'polls for updates when started', ->
    expect(@windowImpl.setInterval).to.have.been.called

  it 'remembers notices when they are dismissed', ->
    expect(Notifications.getActive()).to.deep.equal(TEST_NOTICES)
    Notifications.acknowledge(TEST_NOTICES[0].id)
    expect(@windowImpl.localStorage.setItem).to.have.been.calledWith('ox-cc-notifications', '["1"]')

  it 'does not list items that are ignored', ->
    @windowImpl.localStorage.getItem.returns('["2"]')
    Notifications.loaded(data: TEST_NOTICES)
    expect(Notifications.getActive()).to.deep.equal([ TEST_NOTICES[0] ])

  it 'removes outdated ids from localstorage', (done) ->
    # mock that we've observed the current notices
    @windowImpl.localStorage.getItem.returns('["1", "2"]')
    expect(@windowImpl.localStorage.setItem).not.to.have.been.called

    # load a new set of messages that do not include the previous ones
    Notifications.loaded(data: [{id: '3', message: 'message three'}])

    # 1 and 2 are removed
    expect(@windowImpl.localStorage.setItem).to.have.been.calledWith('ox-cc-notifications', '[]')
    done()
