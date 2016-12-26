React = require 'react'
classnames = require 'classnames'

NewCourseRegistration = require './new-registration'
Course = require './model'
LoginGateway = require '../user/login-gateway'
LaptopAndMug = require '../graphics/laptop-and-mug'

EnrollOrLogin = React.createClass
  getInitialState: ->
    isOpen: false

  toggleOpen: (isOpen) ->
    @setState({isOpen})

  render: ->
    {isOpen} = @state

    signUpClasses = classnames 'sign-up'


    <div className="enroll-or-login">
      <LaptopAndMug height=400 />
      <div className="body">
        <LoginGateway
          className={signUpClasses}
          onToggle={@toggleOpen}
        />
      </div>
    </div>

module.exports = EnrollOrLogin
