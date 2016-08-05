{Testing, expect, sinon, _, React} = require 'shared/test/helpers'

ErrorNotification = require 'concept-coach/error-notification'
api = require 'api'

ContainedNotification = React.createClass
  displayName: 'ContainedNotification'
  render: ->
    <div className='notice-container'>
      <ErrorNotification ref='notice' container={@} {...@props}/>
    </div>

describe 'Error Notification', ->

  it 'does not render if there are no errors', ->
    Testing.renderComponent( ContainedNotification ).then ({dom}) ->
      expect(dom.querySelector('.errors')).to.be.null

  it 'renders exceptions', ->
    Testing.renderComponent( ContainedNotification ).then ({dom, root}) ->
      expect(dom.querySelector('.errors')).to.be.null
      exception = new Error
      api.channel.emit('error', {exception})
      expect(dom.querySelector('.errors')).to.not.be.null


  it 'displays errors when button is clicked', ->
    Testing.renderComponent( ContainedNotification ).then ({dom}) ->
      exception = new Error("You have errors!")
      api.channel.emit('error', {exception})

      btn = dom.querySelector('.-display-errors')
      expect(btn.textContent).equal('Show Details')
      Testing.actions.click btn
      expect(btn.textContent).equal('Hide Details')
      expect(dom.querySelector('.errors-listing').textContent).equal('Error: You have errors!')
