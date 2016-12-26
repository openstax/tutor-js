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



EnrollOrLogin = React.createClass

  propTypes:
    windowImpl: LoginGateway.windowPropType

  getDefaultProps: ->
    windowImpl: window

  getInitialState: ->
    isOpen: false

  toggleOpen: (isOpen) ->
    @setState({isOpen})

  onLogin: ->
    LoginGateway.openWindow(@props.windowImpl, {type: 'login'})

  onSignup: ->
    LoginGateway.openWindow(@props.windowImpl, {type: 'signup'})

  render: ->
    {isOpen} = @state

    signUpClasses = classnames 'sign-up'

    body =
      if LoginGateway.isActive()
        <LoginGateway className={signUpClasses} onToggle={@toggleOpen} />
      else
        <EnrollChoices onLogin={@onLogin} onSignup={@onSignup} />

    <div className="enroll-or-login">
      <LaptopAndMug height=400 />
      <div className="body">
        {body}
      </div>
    </div>

module.exports = EnrollOrLogin
