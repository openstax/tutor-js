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
    url = "#{bookUrl}:3?enrollment_code=#{code}"
    section =
      <CourseGroupingLabel lowercase courseId={@props.courseId} />

    msg = """
      Concept Coach is a free learning tool embedded in your online book. After reading a section of the book, launch Concept Coach to complete practice questions and give your learning a boost.

      To register for Concept Coach:

      1. Click or paste this link in your web browser to visit the class textbook:
        #{url}

      The link has your enrollment code for this Concept Coach course embedded. Course Enrollment Code: #{code}

      2. Click "Jump to Concept Coach"

      In the browser, click the orange “Jump to Concept Coach” button to jump to the Concept Coach widget at the end of the section.

      3. Click “Enroll in This Course”

      Click the orange “Enroll in This Course” button to open your Concept Coach log-in window.

      4. Click Sign Up and Enroll (or Login and Enroll if you already have an account).

      If you’re new to Concept Coach, you’ll be prompted to create a free account. If you’ve used Concept Coach before, log in using your existing OpenStax Concept Coach account.

      5. Enter your school-issued ID

      On the enrollment confirmation screen, input your school-issued ID number used for grading so your instructor can identify you.

      6. Continue to your Concept Coach questions!

      You can also find your Concept Coach book by visiting cc.openstax.org and clicking “Student Portal.” If you get to your book this way, and have not already enrolled, you may be asked to enter your enrollment code:  Course Enrollment Code: #{code}
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
      className="settings-edit-period-modal">

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>{TITLE}</BS.Modal.Title>
      </BS.Modal.Header>

      <BS.Modal.Body>
        <div className='enrollment-code'>
          {codeInstructions}
        </div>
      </BS.Modal.Body>

    </BS.Modal>

  render: ->
    <BS.Button onClick={@open} bsStyle='link' className='control cc-enrollment-code'>
      <Icon type='qrcode' /> {TITLE}
      {@renderForm()}
    </BS.Button>
