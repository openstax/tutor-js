React = require 'react'
classnames = require 'classnames'

NewCourseRegistration = require './new-registration'
Course = require './model'
LoginGateway = require '../user/login-gateway'
LaptopAndMug = require '../concept-coach/laptop-and-mug'

EnrollOrLogin = React.createClass
  getInitialState: ->
    isOpen: false

  toggleOpen: (isOpen) ->
    @setState({isOpen})

  render: ->
    {isOpen} = @state

    signUpClasses = classnames 'sign-up',
      'btn btn-primary btn-lg': not isOpen

    <div className="enroll-or-login">
      <LaptopAndMug height=400 />
      <div className="body">
        <LoginGateway className={signUpClasses} onToggle={@toggleOpen}>Sign up for Concept Coach</LoginGateway>
        <p className="code-required">
          Enrollment code required
        </p>
        <p className="contact">
          No enrollment code? Contact your instructor.
        </p>
        <div className="login">
          Already have an account? <LoginGateway className="login">Sign in</LoginGateway>
        </div>
      </div>
    </div>

module.exports = EnrollOrLogin
