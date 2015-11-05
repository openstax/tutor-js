React = require 'react'
BS = require 'react-bootstrap'

UserStatus = require '../user/status'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'

{ExerciseStep} = require '../exercise'

STEP_ID = '4571'

Demo = React.createClass
  displayName: 'Demo'

  onAttemptLogin: ->
    @setState(displayLogin: true)

  onLoginComplete: ->
    @setState(displayLogin: false)

  render: ->
    if @state?.displayLogin
      return <UserLogin onComplete={@onLoginComplete} />

    demos =
      exercise: <ExerciseStep id={STEP_ID}/>

    demos = _.map(demos, (demo, name) ->
      <BS.Row>
        <BS.Col xs={12}>
          <h1>{"#{name}"}</h1>
          <section className={"#{name}-demo"}>{demo}</section>
        </BS.Col>
      </BS.Row>
    )
    <BS.Grid className='demo'>
      <UserStatus />
      <UserLoginButton onAttemptLogin={@onAttemptLogin} />
      {demos}
    </BS.Grid>

module.exports = Demo
