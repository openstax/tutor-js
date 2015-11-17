React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TutorInput} = require '../tutor-input'

module.exports = React.createClass
  displayName: 'PeriodEnrollmentCode'
  propTypes:
    activeTab: React.PropTypes.object.isRequired
    periods: React.PropTypes.array.isRequired

  getEnrollmentCode: (name, periods) ->
    period = _.findWhere(periods, {name: name})
    period.enrollment_code

  renderForm: ->
    {activeTab, periods} = @props
    enrollmentCode = @getEnrollmentCode(activeTab.name, periods)
    codeInstructions = "Placeholder for instructions: #{enrollmentCode}"

    <BS.Modal
      {...@props}
      title='Get Enrollment Code'
      className="teacher-edit-period-modal">

      <div className='modal-body teacher-edit-period-form'>
        <div className='enrollment-code'>
          {codeInstructions}
        </div>
      </div>

    </BS.Modal>

  render: ->
    <BS.OverlayTrigger
      ref='overlay'
      rootClose={true}
      trigger='click'
      overlay={@renderForm()}>
        <BS.Button bsStyle='link' className='show-enrollment-code'>
          <i className='fa fa-qrcode' /> Get Enrollment Code
        </BS.Button>
    </BS.OverlayTrigger>
