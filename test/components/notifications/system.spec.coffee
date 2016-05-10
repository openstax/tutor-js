{Testing, expect, sinon, _} = require 'test/helpers'

SystemNotifications = require 'components/notifications/system'
Notifications = require 'model/notifications'

describe 'System Notifications', ->

  beforeEach ->
    sinon.stub(Notifications, 'acknowledge')
    @props =
      notice:
        id: '1'
        message: 'a test notice'
        type: 'tutor'

  afterEach ->
    Notifications.acknowledge.restore()

  it 'remembers notice as ignored when dismiss is clicked', ->
    Testing.renderComponent( SystemNotifications, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.dismiss'))
      expect(Notifications.acknowledge).to.have.been.calledWith(@props.notice)
