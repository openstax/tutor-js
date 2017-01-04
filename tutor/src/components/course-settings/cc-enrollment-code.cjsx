# coffeelint: disable=max_line_length

React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TutorInput} = require '../tutor-input'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'
Title = (props) ->
  <span>
    Send enrollment instructions for this <CourseGroupingLabel lowercase courseId={props.courseId} />
  </span>

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

    msg = """
      Concept Coach is a free tool to help you remember and understand what you read. After reading a section of the book, launch Concept Coach to complete practice questions and give your learning a boost.

      1. Click or paste this link in your web browser to visit the class textbook:
      #{url}

      2. Click the orange “Jump to Concept Coach” button.

      3. Click the orange “Enroll in This Course” button in the Concept Coach widget.

      4. Follow the prompts to complete the enrollment process. Then, you’ll be taken to your Concept Coach questions.

      5. To find your Concept Coach book in the future, visit cc.openstax.org and click “Student Portal.” Use the book table of contents to locate the section(s) assigned by your instructor. Read the section, then launch Concept Coach at the bottom of the section.
    """
    <div>


      <div className='callout'>
        <p>
          <span className='emphasis'>
            Send these instructions to students in this <CourseGroupingLabel lowercase courseId={@props.courseId} />
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
      className="settings-cc-enrollment-code-modal">

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>
          <Title {...@props} />
        </BS.Modal.Title>
      </BS.Modal.Header>

      <BS.Modal.Body>
        <div className='enrollment-code'>
          {codeInstructions}
        </div>
      </BS.Modal.Body>

    </BS.Modal>

  render: ->
    <BS.Button onClick={@open} bsStyle='link' className='control cc-enrollment-code'>
      <Icon type='qrcode' /> <Title {...@props} />
      {@renderForm()}
    </BS.Button>
