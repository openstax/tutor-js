React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass

  displayName: 'DontForgetPanel'
  propTypes:
    courseId: React.PropTypes.any.isRequired

  render: ->
    <BS.Panel header="Don't Forget">
      <BS.Col xs={3}>
        View Feedback<br/>
         HW 5: Acceleration
      </BS.Col>
      <BS.Col xs={3}>
       Recover Credit<br/>
       HW 5: Acceleration
      </BS.Col>
      <BS.Col xs={3}>
        View Feedback<br/>
        HW 4: Displacement
      </BS.Col>
      <BS.Col xs={3}>
        Recover Credit<br/>
        HW 4: Displacement
      </BS.Col>
    </BS.Panel>


