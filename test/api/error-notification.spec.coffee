{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

ErrorNotification = require 'concept-coach/error-notification'
api = require 'api'

describe 'Error Notification', ->

  it 'does not render if there are no errors', ->
    Testing.renderComponent( ErrorNotification ).then ({dom}) ->
      expect(dom).to.be.null

  it 'renders exceptions', ->
    Testing.renderComponent( ErrorNotification ).then ({element}) ->
      expect(element.getDOMNode()).to.be.null
      exception = new Error
      api.channel.emit('error', {exception})
      el = element.getDOMNode()
      expect(el).not.to.be.null


  it 'displays errors when button is clicked', ->
    Testing.renderComponent( ErrorNotification ).then ({element}) ->
      exception = new Error("You have errors!")
      api.channel.emit('error', {exception})

      el = element.getDOMNode()
      btn = el.querySelector('.-display-errors')
      expect(btn.textContent).equal('Show Details')
      Testing.actions.click btn
      expect(btn.textContent).equal('Hide Details')
      expect(el.querySelector('.errors-listing').textContent).equal('Error: You have errors!')
