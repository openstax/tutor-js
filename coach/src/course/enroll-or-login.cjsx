React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

NewCourseRegistration = require './new-registration'
Course = require './model'
LoginGateway = require '../user/login-gateway'
LaptopAndMug = require '../graphics/laptop-and-mug'

EnrollSignUp = (props) ->
  <div className="signup">
    <h3>First-time user?</h3>
    <p>
      Sign up for an OpenStax account and enroll in this course
    </p>
    <hr/>
    <BS.Button onClick={props.onSignup} className='btn-openstax-primary'>
      Sign up and Enroll
    </BS.Button>
  </div>

EnrollSignUp.displayName = 'EnrollSignUp'

EnrollLogin = (props) ->
  <div className="login">
    Already have an OpenStax account from another course or semester?
    <BS.Button onClick={props.onLogin}>
      Log in and Enroll
    </BS.Button>
  </div>

EnrollLogin.displayName = 'EnrollLogin'

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
        <LoginGateway className={signUpClasses} onLogin={@onLoginCompleted}
          loginType={@state.type} displayAfterLogin='registration' />
      else
        [
          <EnrollSignUp onSignup={@onSignup}  key='enroll-sign-up'/>
          <EnrollLogin onLogin={@onLogin}  key='enroll-log-in'/>
        ]

    <div className="enroll-or-login">
      {body}
    </div>

module.exports = EnrollOrLogin
