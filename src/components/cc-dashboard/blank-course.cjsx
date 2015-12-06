_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
DesktopImage = require './desktop-image'

BlankCourse = React.createClass

  propTypes:
    courseId: React.PropTypes.string

  render: ->
    <div className="blank-course">
      <h3 className="title">
        Welcome to your OpenStax Concept Coach™ Dashboard
      </h3>
      <div className="body">
        <h3>Getting Started</h3>
        <div className="side-by-side">
          <ol>
            <li>
              Add sections to your course by clicking on your name in the top
              right corner and selecting "Course Settings and Roster."
            </li>
            <li>
              Generate a student enrollment code for each section you create.
            </li>
            <li>
              Distribute the enrollment codes for each section and textbook URL
              (which is the same for each section) to your students.
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
          <DesktopImage courseId={@props.courseId} />
        </div>
      </div>
    </div>


module.exports = BlankCourse
