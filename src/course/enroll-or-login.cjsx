React = require 'react'

NewCourseRegistration = require './new-registration'
Course = require './model'
LoginGateway = require '../user/login-gateway'

EnrollOrLogin = React.createClass

  render: ->
    <div className="enroll-or-login">
      <h2 className="title">I already have an account.</h2>
      <LoginGateway className='login'>Log in</LoginGateway>
      <div className="enroll">
        <h3>
          I’m new to Concept
          Coach. <LoginGateway className="sign-up">
            Sign up with enrollment code
          </LoginGateway>
        </h3>
        <p className="hint">
          If you don’t have an enrollment code, contact your instructor.
        </p>
      </div>
    </div>

module.exports = EnrollOrLogin
