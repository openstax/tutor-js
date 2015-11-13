React = require 'react'
BS = require 'react-bootstrap'

AccountsIframe = require './accounts-iframe-mixin'

UserProfile = React.createClass

  mixins: [AccountsIframe]
  propTypes:
    onComplete: React.PropTypes.func.isRequired

  # called by iframe when it's content is loaded and it's ready for requests
  iFrameReady: -> @sendCommand('loadPage', 'profile')

  render: ->
    <div className="-user-profile">
      <i className='close-icon pull-right' onClick={@props.onComplete}/>
      {@renderIframe()}
    </div>


module.exports = UserProfile
