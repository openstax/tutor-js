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

  it 'displays icon based on level', ->
    @props.notice.level = 'alert'
    Testing.renderComponent( SystemNotifications, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.fa-exclamation-triangle')).to.exist

  it 'displays icon provided', ->
    @props.notice.icon = 'beer'
    Testing.renderComponent( SystemNotifications, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.fa-beer')).to.exist
