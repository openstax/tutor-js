_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
{ Link } = require 'react-router'

DesktopImage = require './desktop-image'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'
classnames = require 'classnames'

BlankCourse = React.createClass

  propTypes:
    courseId: React.PropTypes.string
    inPeriod: React.PropTypes.bool

  render: ->
    glprops = {lowercase:true, courseId: @props.courseId}
    classes = classnames 'blank-course', 'in-period': @props.inPeriod
    <div className="#{classes}">
      <h3 className="title">
        Welcome to your OpenStax Concept Coach™ Dashboard
      </h3>
      <div className="body">
        <h3>Getting Started</h3>
        <div className="side-by-side">
          <div className="help">
            <ol>
              <li>
                Add <CourseGroupingLabel plural {...glprops} /> to
                your course by clicking on your name in the top
                right corner and selecting "Course Settings and Roster."
              </li>
              <li>
                Generate a student enrollment code for
                each <CourseGroupingLabel {...glprops} /> you
                create.
              </li>
              <li>
                Distribute the enrollment codes for
                each <CourseGroupingLabel {...glprops} /> and
                textbook URL (which is the same for
                each <CourseGroupingLabel {...glprops} />) to
                your students.
              </li>
              <li>
                Encourage your students to login to Concept Coach as part of their
                first reading assignment.
              </li>
              <li>
                As your students begin using Concept Coach, you will be able to
                track their performance and see their scores in your dashboard.
                <p>
                  Performance metrics will appear when at least 10% of students
                  have completed a Concept Coach reading
                </p>
              </li>
            </ol>
            <Link className='settings btn btn-default btn-large'
              to="/courses/#{@props.courseId}/t/settings"
            >
              <Icon type='plus' /> Add
              a <CourseGroupingLabel {...glprops} /> to your course
            </Link>

          </div>
          <div className='graphic'>
            <div className='svg-container'>
              <DesktopImage courseId={@props.courseId} />
            </div>
          </div>
        </div>

      </div>
    </div>


module.exports = BlankCourse
