{Testing, _} = require 'shared/specs/helpers'

EmailNotification = require 'components/notifications/email'

describe 'Email Notifications', ->
  props = null

  beforeEach ->
    props =
      onDismiss: jest.fn()
      notice:
        id: 1
        value: 'one'
        message: 'a test notice'
        type: 'tutor'
        on: jest.fn()
        off: jest.fn()
        sendConfirmation: jest.fn()
        sendVerification: jest.fn()

  it 'displays verify message initially', ->
    Testing.renderComponent( EmailNotification, props: props ).then ({dom}) =>
      expect(dom.textContent).to.contain('Verify now')
      expect(dom.querySelector('input')).not.to.exist
      Testing.actions.click(dom.querySelector('.action'))
      expect(props.notice.sendConfirmation).toHaveBeenCalled()

  it 'displays verification input', ->
    props.notice.verifyInProgress = true
    Testing.renderComponent( EmailNotification, props: props ).then ({dom}) =>
      expect(dom.querySelector('input')).to.exist
      expect(dom.textContent).to.contain('Check your email')
      dom.querySelector('input').value = '123456'
      Testing.actions.click(dom.querySelector('.action'))
      expect(props.notice.sendVerification).toHaveBeenCalledWith('123456', expect.anything())
