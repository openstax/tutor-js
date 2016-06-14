React = require 'react'
classnames = require 'classnames'

NewCourseRegistration = require './new-registration'
Course = require './model'
LoginGateway = require '../user/login-gateway'

EnrollOrLogin = React.createClass
  getInitialState: ->
    isOpen: false

  toggleOpen: (isOpen) ->
    @setState({isOpen})

  render: ->
    {isOpen} = @state

    signInClasses = classnames 'login',
      'btn btn-primary btn-lg': not isOpen

    newToConceptCoach = 'I\'m new to Concept Coach.'

    <div className="enroll-or-login">
      <LoginGateway className={signInClasses} onToggle={@toggleOpen}>Sign in</LoginGateway>
      <div className="enroll">
        <h3>
          {newToConceptCoach}  <LoginGateway className="sign-up">
            Sign up with your enrollment code
          </LoginGateway>
        </h3>
        <p className="hint">
          If you don’t have an enrollment code, contact your instructor.
        </p>
      </div>
      <div className='enroll-instructors-interest'>
        <p>
          <strong>
            Instructors - Are you interested in using Concept Coach in your course?
          </strong>
        </p>
        <a
          className='enroll-instructors-interest-learn-more'
          href='http://cc.openstax.org/'>Learn More &gt;</a>
      </div>
    </div>

module.exports = EnrollOrLogin
