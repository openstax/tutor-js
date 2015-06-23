React = require 'react'
BS = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'CourseInformation'
  propTypes:
    course: React.PropTypes.object.isRequired

  render: ->
    <div className="information">
      <h2>Course Information</h2>
      <BS.Row>
        <BS.Input type='text' label='Course Name'
          defaultValue={@props.course.name}
          ref="name", name="name"
          labelClassName='col-xs-2'
          wrapperClassName='col-xs-10' />
      </BS.Row>
      <BS.Row>
        <BS.Input type='select' label='Time Zone'
          ref="name"
          defaultValue="Central"
          labelClassName='col-xs-2'>
          <option value="Eastern">Eastern</option>
          <option value="Central">Central</option>
          <option value="Mountain">Mountain</option>
          <option value="Pacific">Pacific</option>
        </BS.Input>
      </BS.Row>
      <BS.Row>
        <BS.Col xs=2>
          Tutor Settings
        </BS.Col>
        <BS.Col xs=10>
          <label>
            <input type='radio' name="schedule" defaultChecked={true} />
            Learning optimized practice schedule
          </label>
          <p>
            Homework problems on a particular topic will be distributed
            through several homework assignments, which strengthens
            learning and retention of information.
          </p>
          <label>
            <input type='radio' name="schedule" defaultChecked={false} />
            Include personalized homework problems
          </label>
          <p>
            You choose problems every student will work and the system
            will add some personalized problems based on that student’s
            past performance.
          </p>
        </BS.Col>
      </BS.Row>
    </div>
