React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TutorInput} = require '../tutor-input'

TITLE = 'Get Student Enrollment Code'

module.exports = React.createClass
  displayName: 'PeriodEnrollmentCode'
  propTypes:
    activeTab: React.PropTypes.object.isRequired
    periods: React.PropTypes.array.isRequired

  getEnrollmentCode: (name, periods) ->
    period = _.findWhere(periods, {name: name})
    period.enrollment_code

  getInstructions: (code) ->
    <div>
      <p>The two-word enrollment code for this section is:</p>
      <p className='code'>{code}</p>
      <p>Distribute this code to the students in this
       section along with the URL for your textbook to
       give them access to Concept Coach.</p>
      <p>Each section of your course will have a
       different two-word enrollment code.</p>
    </div>

  renderForm: ->
    {activeTab, periods} = @props
    enrollmentCode = @getEnrollmentCode(activeTab.name, periods)
    codeInstructions = @getInstructions(enrollmentCode)

    <BS.Modal
      {...@props}
      title={TITLE}
      className="teacher-edit-period-modal">

      <div className='modal-body teacher-enrollment-code-modal'>
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
          <i className='fa fa-qrcode' /> {TITLE}
        </BS.Button>
    </BS.OverlayTrigger>
