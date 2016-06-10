# coffeelint: disable=max_line_length

React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TutorInput} = require '../tutor-input'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'
TITLE = 'Get Student Enrollment Code'

module.exports = React.createClass
  displayName: 'PeriodEnrollmentCode'
  propTypes:
    period: React.PropTypes.object.isRequired
    bookUrl: React.PropTypes.string.isRequired
    bookName: React.PropTypes.string.isRequired

  getInitialState: ->
    showModal: false

  close: ->
    @setState({showModal: false})

  open: ->
    @setState({showModal: true})

  getInstructions: (code) ->
    {bookUrl, bookName} = @props
    # appends :3 to skip book intro
    url = bookUrl + ':3'

    msg = """
       As you read your OpenStax textbook online, you will come across embedded Concept Coach question sets to help you understand and retain what you’ve read.

       Follow the steps below to register for Concept Coach:

       1. Paste this link in your web browser to visit the class textbook:
       #{url}

       2. Click on section 1.1 in the book. Scroll to the bottom of the section and click on the Concept Coach button.

       3. On the right side of the screen, enter your enrollment code:
       #{code}

       4. On the next screen, click “Click to begin login.” Then click “Sign up” and follow the prompts to create your free account.

       5. Continue to your Concept Coach questions!
    """
    <div>

      <div className='summary'>
        <p>The enrollment code for this section is:</p>
        <p className='code'>{code}</p>
        <p>Each section of your course will have a
         different enrollment code.</p>
      </div>

      <div className='callout'>
        <p>
          <span className='emphasis'>Copy the example message below </span>
          to post in your Learning Management System or to email your students:
        </p>
      </div>

      <textarea readOnly onClick={@selectText} value={msg} />

    </div>

  selectText: (ev) ->
    ev.target.select()

  renderForm: ->
    {period} = @props
    enrollmentCode = period.enrollment_code
    codeInstructions = @getInstructions(enrollmentCode)

    <BS.Modal
      show={@state.showModal}
      onHide={@close}
      className="teacher-edit-period-modal">

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>{TITLE}</BS.Modal.Title>
      </BS.Modal.Header>

      <div className='modal-body teacher-enrollment-code-modal'>
        <div className='enrollment-code'>
          {codeInstructions}
        </div>
      </div>

    </BS.Modal>

  render: ->
    <span className='cc-enrollment-code'>
      <BS.Button onClick={@open} bsStyle='link' className='show-enrollment-code'>
        <Icon type='qrcode' /> {TITLE}
      </BS.Button>
      {@renderForm()}
    </span>
