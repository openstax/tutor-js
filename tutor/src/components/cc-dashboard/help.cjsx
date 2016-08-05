_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

DesktopImage = require './desktop-image'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'
classnames = require 'classnames'

CCDashboardHelp = React.createClass

  propTypes:
    courseId: React.PropTypes.string
    inPeriod: React.PropTypes.bool

  contextTypes:
    router: React.PropTypes.func

  render: ->
    courseId = @props.courseId or @context.router.getCurrentParams().courseId
    glprops = {lowercase:true, courseId: courseId}
    section =
      <CourseGroupingLabel lowercase {...glprops} />
    <div className='cc-dashboard-help'>
      <h3 className="title">
        Welcome to Concept Coach™
      </h3>
      <div className="body">
        <h3>Getting Started</h3>
        <p className="fine-print">This guide is always accessible from your main menu.</p>
        <div className="side-by-side">
          <div className="help">
            <b>
              Add <CourseGroupingLabel plural {...glprops} /> to your course.
            </b>
            <ol>
              <li>
                Click your name in the top right corner and select “Course Settings and Roster”
              </li>
              <li>
                Click the blue “Add Section” link and follow the prompts to create your section.
                If you have more than one section, repeat this step as needed.
              </li>
            </ol>
            <b>Get student enrollment code and send to your students.</b>
            <ol>
              <li>
                Select your first section and click the blue “Get Student Enrollment Code” link.
              </li>
              <li>
                Copy the example message and share this message with your students in that section.
              </li>
              <li>
                Repeat this step for each section of your course (every section has a different enrollment code).
              </li>
            </ol>
            <b>Assign Concept Coach.</b>
            <ol>
              <li>
                On the top menu, click “Get Assignment Links.” Follow the instructions to assign Concept Coach question sets.
              </li>
              <li>
                View your students’ progress.
              </li>
              <li>
                As your students begin using Concept Coach, you will be able to track
                their performance in your dashboard.
              </li>
            </ol>
            <div className="tip">
              <b>Tip</b>:
              To view all Concept Coach questions, click your name in the top right corner of your dashboard
              and select “Question Library.”
            </div>
          </div>
          <div className='graphic'>
            <div className='svg-container'>
              <DesktopImage courseId={courseId} />
            </div>
          </div>
        </div>

      </div>
    </div>


module.exports = CCDashboardHelp
