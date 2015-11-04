React = require 'react'
BS = require 'react-bootstrap'

{Task} = require '../task'
UserStatus = require '../user/status'
{ExerciseStep} = require '../exercise'

COLLECTION_UUID = 'C_UUID'
MODULE_UUID = 'm_uuid'

Demo = React.createClass
  displayName: 'Demo'
  render: ->
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
      {demos}
    </BS.Grid>

module.exports = Demo
