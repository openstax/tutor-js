{Testing, expect, sinon, _} = require 'test/helpers'

EmailNotification = require 'components/notifications/email'

describe 'Email Notifications', ->

  beforeEach ->
    @props =
      notice:
        id: '1'
        message: 'a test notice'
        type: 'tutor'
        on: sinon.spy()
        sendConfirmation: sinon.spy()
        sendVerification: sinon.spy()

  it 'displays verify message initially', ->
    Testing.renderComponent( EmailNotification, props: @props ).then ({dom}) =>
      expect(dom.textContent).to.contain('Verify now')
      expect(dom.querySelector('input')).not.to.exist
      Testing.actions.click(dom.querySelector('.action'))
      expect(@props.notice.sendConfirmation).to.have.been.calledWith()

  it 'displays verification input', ->
    @props.notice.verifyInProgress = true
    Testing.renderComponent( EmailNotification, props: @props ).then ({dom}) =>
      expect(dom.querySelector('input')).to.exist
      expect(dom.textContent).to.contain('Check your email')
      dom.querySelector('input').value = '123456'
      Testing.actions.click(dom.querySelector('.action'))
      expect(@props.notice.sendVerification).to.have.been.calledWith('123456', sinon.match.func)
