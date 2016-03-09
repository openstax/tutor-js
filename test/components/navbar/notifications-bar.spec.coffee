{Testing, expect, sinon, _} = require '../helpers/component-testing'

NotificationsBar = require '../../../src/components/navbar/notifications-bar'

{NotificationActions, NotificationStore} = require '../../../src/flux/notifications'

TEST_NOTICES = require '../../../api/notifications'

describe 'Notifications Bar', ->
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

  it 'doesnt render when there are no notifications', ->
    NotificationActions.loadedUpdates([])
    Testing.renderComponent( NotificationsBar ).then ({dom}) ->
      expect(dom).to.be.null

  it 'renders active notices', ->
    Testing.renderComponent( NotificationsBar ).then ({dom}) ->
      expect(dom.textContent).to.contain(TEST_NOTICES[0].message)

  it 'remembers notice as ignored when dismiss is clicked', ->
    Testing.renderComponent( NotificationsBar ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.dismiss'))
      expect(@windowImpl.localStorage.setItem).to.have.been.calledWith('ox-notifications', '["1"]')
