React = require 'react'
BS = require 'react-bootstrap'

UserStatus = require '../user/status'
{ExerciseStep} = require '../exercise'

STEP_ID = '4571'

Demo = React.createClass
  displayName: 'Demo'
  render: ->
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
      {demos}
    </BS.Grid>

module.exports = Demo
