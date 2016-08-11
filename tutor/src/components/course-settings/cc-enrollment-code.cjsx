# coffeelint: disable=max_line_length

React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TutorInput} = require '../tutor-input'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'
TITLE = 'Your student enrollment code'

module.exports = React.createClass
  displayName: 'PeriodEnrollmentCode'
  propTypes:
    courseId: React.PropTypes.string.isRequired
    period:   React.PropTypes.object.isRequired
    bookUrl:  React.PropTypes.string.isRequired
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
    section =
      <CourseGroupingLabel lowercase courseId={@props.courseId} />

    msg = """
      Concept Coach is a free learning tool embedded in your online book. After reading a section of the book, launch Concept Coach to complete practice questions and give your learning a boost.

      To register for Concept Coach:

      1. Paste this link in your web browser to visit the class textbook:
      #{url}

      You can also find your Concept Coach book by visiting cc.openstax.org and clicking “Student Portal.”

      1. In the browser, click the orange “Jump to Concept Coach” button to jump to to the Concept Coach widget at the end of the section. Click “Launch Concept Coach” to open your Concept Coach log-in window.

      2. If you’re new to Concept Coach, click “Sign up for Concept Coach” and follow the prompts to create your free account. If you’ve used Concept Coach before, click “Sign In” to sign in.

      3. After signing in, enter your enrollment code for this course. Your enrollment code is:
      #{code}

      4. On the enrollment confirmation screen, input your school-issued ID number so your instructor can identify you.

      5. Continue to your Concept Coach questions!
    """
    <div>

      <div className='summary'>
        <p>The enrollment code for this {section} is:</p>
        <p className='code'>{code}</p>
        <p>Each {section} of your course will have a different enrollment code.</p>
      </div>

      <div className='callout'>
        <p>
          <span className='emphasis'>
            Send the following enrollment instructions to students in this section of your course:
          </span>
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
