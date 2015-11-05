React = require 'react'
BS = require 'react-bootstrap'

{Task} = require '../task'
UserStatus = require '../user/status'
UserLoginButton = require '../user/login-button'
UserLogin = require '../user/login'

{ExerciseStep} = require '../exercise'

COLLECTION_UUID = 'C_UUID'
MODULE_UUID = 'm_uuid'

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
      task: <Task collectionUUID={COLLECTION_UUID} moduleUUID={MODULE_UUID}/>

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
