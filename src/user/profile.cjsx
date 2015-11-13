React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'

AccountsIframe = require './accounts-iframe-mixin'

UserProfile = React.createClass

  mixins: [AccountsIframe]
  propTypes:
    onComplete: React.PropTypes.func.isRequired

  # called by iframe when it's content is loaded and it's ready for requests
  onIframeReady: ->
    @loadPage('profile')

  render: ->
    classlist = classnames('user-profile', 'is-loading': @state.isLoading)

    <div className={classlist}>
      <div className="heading">
        <h3 className="title">{@state?.title}</h3>
        <i className='close-icon' onClick={@props.onComplete}/>

      </div>
      {@renderIframe()}
    </div>


module.exports = UserProfile
