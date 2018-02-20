{Testing, expect, sinon, _} = require 'shared/specs/helpers'

SystemNotifications = require 'components/notifications/system'
Notifications = require 'model/notifications'

describe 'System Notifications', ->
  props = null

  beforeEach ->
    props =
      onDismiss: sinon.spy()
      notice:
        id: '1'
        message: 'a test notice'
        type: 'tutor'

  it 'remembers notice as ignored when dismiss is clicked', ->
    Testing.renderComponent( SystemNotifications, props: props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.dismiss'))
      expect(props.onDismiss).to.have.been.called

  it 'displays icon based on level', ->
    props.notice.level = 'alert'
    Testing.renderComponent( SystemNotifications, props: props ).then ({dom}) ->
      expect(dom.querySelector('.fa-exclamation-triangle')).to.exist

  it 'displays icon provided', ->
    props.notice.icon = 'beer'
    Testing.renderComponent( SystemNotifications, props: props ).then ({dom}) ->
      expect(dom.querySelector('.fa-beer')).to.exist
