_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

DesktopImage = require './desktop-image'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'

BlankCourse = React.createClass

  propTypes:
    courseId: React.PropTypes.string

  render: ->
    glprops = {lowercase:true, courseId: @props.courseId}
    <div className="blank-course">
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
                track their performance and see their scores in your dashboard
              </li>
            </ol>
            <Router.Link className='settings btn btn-default btn-large'
              to='courseSettings' params={courseId: @props.courseId}
            >
              <Icon type='plus' /> Add
              a <CourseGroupingLabel {...glprops} /> to your course
            </Router.Link>

          </div>
          <DesktopImage courseId={@props.courseId} />
        </div>

      </div>
    </div>


module.exports = BlankCourse
