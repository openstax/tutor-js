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
    classes = classnames 'cc-dashboard-help-page', 'in-period': @props.inPeriod
    section =
      <CourseGroupingLabel lowercase {...glprops} />
    <div className="#{classes}">
      <h3 className="title">
        Welcome to Concept Coach™
      </h3>
      <div className="body">
        <h3>Getting Started</h3>
        <div className="side-by-side">
          <div className="help">
            <ol>
              <li>
                <b>
                  Add <CourseGroupingLabel plural {...glprops} /> to your course.
                </b>
                Click your name in the top right corner and select Course Settings and Roster
                On the Course Settings and Roster, click Add Section.
                If you have more than one section, repeat this step as needed.
              </li>
              <li>
                <b>Get student enrollment code and send to
                your students.</b> While still on the Course Settings and Roster page, select your
                first {section}.
                Under the section name, click Get Student Enrollment Code. Copy the example message,
                and send it to your students. If you have more than
                one {section}, repeat
                this step for <i>each</i> {section}.
                Each {section} has a different enrollment code.
              </li>
              <li>
                As your students begin using Concept Coach, you will be able to track their performance in your dashboard.
              </li>
            </ol>
            <Router.Link className='settings btn btn-default btn-large'
              to='courseSettings' params={{courseId}}
            >
              <Icon type='plus' /> Add a {section} to your course
            </Router.Link>

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
