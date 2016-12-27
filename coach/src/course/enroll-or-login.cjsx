React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

NewCourseRegistration = require './new-registration'
Course = require './model'
LoginGateway = require '../user/login-gateway'
LaptopAndMug = require '../graphics/laptop-and-mug'


EnrollChoices = (props) ->
  <div className="enroll-choices">
    <div className="first-time">
      <h3>First-time user?</h3>
      <p>
        Sign up for an OpenStax account and enroll in this course
      </p>
    </div>
    <div className="signup">
      <BS.Button onClick={props.onSignup} className='btn-openstax-primary'>
        Sign Up and Enroll
      </BS.Button>
    </div>
    <div className="login">
      Already have an OpenStax account from another course or semester?
      <BS.Button onClick={props.onLogin}>
        Log in and Enroll
      </BS.Button>
    </div>
  </div>

EnrollChoices.displayName = 'EnrollChoices'


EnrollOrLogin = React.createClass

  propTypes:
    windowImpl: LoginGateway.windowPropType

  getInitialState: -> {}

  getDefaultProps: ->
    windowImpl: window

  onLoginCompleted: ->
    @forceUpdate()

  onLogin: ->  @openGateway('login')
  onSignup: -> @openGateway('signup')

  openGateway: (type) ->
    LoginGateway.openWindow(@props.windowImpl, {type})
    @setState({type})

  render: ->
    signUpClasses = classnames 'sign-up'

    body =
      if LoginGateway.isActive()
        <LoginGateway className={signUpClasses} onLogin={@onLoginCompleted} loginType={@state.type} />
      else
        <EnrollChoices onLogin={@onLogin} onSignup={@onSignup} />

    <div className="enroll-or-login">
      <LaptopAndMug height=400 />
      <div className="body">
        {body}
      </div>
    </div>

module.exports = EnrollOrLogin
