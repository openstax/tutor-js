React = require 'react'
ENTER = 'Enter'

{CourseListing} = require './listing'
User = require '../user/model'
Course = require './model'

InviteCodeInput = React.createClass

  propTypes:
    course: React.PropTypes.instanceOf(Course)

  startRegistration: ->
    @props.course.register(React.findDOMNode(@refs.input).value)

  onKeyPress: (ev) ->
    @startRegistration() if ev.key is ENTER

  renderCurrentCourses: ->
    <div className='text-center'>
      <h3>You are not registered for this course.</h3>
      <p>Did you mean to go to one of these?</p>
      <CourseListing
        courses={User.courses}
        cnxUrl={@props.cnxUrl}/>
    </div>

  render: ->
    <div className="form-group">

      {@renderCurrentCourses() if User.courses?.length}
      <h3 className="text-center">Register for this Concept Coach course</h3>
      <hr/>
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
        <label>
          Course invitation code:
          <div className="input-group">
            <input
              ref='input' autoFocus
              onKeyPress={@onKeyPress} type="text" className="form-control"
            />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button"
                onClick={@startRegistration}>Register</button>
            </span>
          </div>
        </label>
      </div>
    </div>

module.exports = InviteCodeInput
