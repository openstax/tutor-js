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
    bookName: React.PropTypes.string.isRequired

  getEnrollmentCode: (name, periods) ->
    period = _.findWhere(periods, {name: name})
    period.enrollment_code

  getInstructions: (code) ->
    {bookUrl, bookName} = @props
    # appends :3 to skip book intro
    url = bookUrl + ':3'
    <div>

      <div className='summary'>
        <p>The two-word enrollment code for this section is:</p>
        <p className='code'>{code}</p>
        <p>Each section of your course will have a
         different two-word enrollment code.</p>
      </div>

      <div className='callout'>
        <p>
          <span className='emphasis'>Copy the example message below </span>
          to post in your Learning Management System or to email your students:
        </p>
      </div>

      <div className='howto'>
        <p>
          As you read your OpenStax textbook online,
           you will come across embedded Concept Coach question sets
            to help you understand and retain what you’ve read.
        </p>
        <p>Follow the steps below to register for Concept Coach:</p>
        <ol>
          <div>
            <span>1.</span> Paste this link in your web browser to visit
             your<a href={url} target='_blank'>{bookName}textbook</a>:
             <div className='emphasis'>{url}</div>
          </div>
          <div>
            <span>2.</span> 
             Click on section 1.1 in the book.
              Scroll to the bottom of the section and click on the Concept Coach button.
          </div>
          <div>
            <span>3.</span> Click "Sign up" and follow the prompts to create your free account.
          </div>
          <div>
            <span>4.</span> 
             At the end of your account set-up, you will be prompted to enter your two-word enrollment
             code: <span className='emphasis'>{code}</span>
          </div>
          <div>
            <span>5.</span> Continue to your Concept Coach questions!
          </div>
        </ol>
      </div>

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
