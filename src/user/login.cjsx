React = require 'react'
classnames = require 'classnames'

AccountsIframe = require './accounts-iframe-mixin'
User  = require './model'
api = require '../api'

UserLogin = React.createClass

  mixins: [AccountsIframe]
  propTypes:
    onComplete: React.PropTypes.func.isRequired

  # called when an login process completes
  onLogin: (payload) ->
    api.channel.emit 'user.status.receive.fetch', data: payload
    @props.onComplete()

  # called by iframe when it's content is loaded and it's ready for requests
  onIframeReady: ->
    # @setState(isLoading: true)
    @sendCommand('displayLogin', User.endpoints.iframe_login)

  render: ->
    classlist = classnames('user-login', 'is-loading': @state.isLoading)
    <div className={classlist}>
      <div className="heading">
        <h3 className="title">{@state?.title}</h3>
      </div>
      {@renderIframe()}
    </div>



module.exports = UserLogin
