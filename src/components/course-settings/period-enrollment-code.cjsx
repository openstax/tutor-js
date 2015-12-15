React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{TutorInput} = require '../tutor-input'
CourseGroupingLabel = require '../course-grouping-label'

TITLE = 'Get Student Enrollment Code'

module.exports = React.createClass
  displayName: 'PeriodEnrollmentCode'
  propTypes:
    activeTab: React.PropTypes.object.isRequired
    periods: React.PropTypes.array.isRequired
    bookUrl: React.PropTypes.string.isRequired

  getEnrollmentCode: (name, periods) ->
    period = _.findWhere(periods, {name: name})
    period.enrollment_code

  getInstructions: (code) ->
    <div>
      <p>
        <span className='emphasis'>Copy the example message below </span>
        to post in your Learning Management System or to email your students:
        As you read your OpenStax textbook online, you will come across embedded Concept Coach quizzes.
        These quizzes use proven cognitive science principles to help you understand and retain what you’ve read.
      </p>
      <p>Follow the steps below to register for Concept Coach:</p>
      <ol>
        <li>
          Click on this <a href="#{@props.bookUrl}:3" target='_blank'>link</a> to
           your Concept Coach-enabled book.
        </li>
        <li>
          Click on section 1.1 in the book. Scroll to the bottom of the section and click on the Concept Coach button.
        </li>
        <li>
          Click "Sign Up" and follow the prompts to create your free account. This will include an email verification step.
        </li>
        <li>
          At the end of your account set-up, you will be prompted to enter your two-word enrollment code:
          <p className='code'>{code}</p>
        </li>
        <li>
          Continue to your Concept Coach questions!
        </li>
      </ol>
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
