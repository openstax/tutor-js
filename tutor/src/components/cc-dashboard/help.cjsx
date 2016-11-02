_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

Router = require '../../helpers/router'
DesktopImage = require './desktop-image'
CourseGroupingLabel = require '../course-grouping-label'
Icon = require '../icon'
classnames = require 'classnames'

CCDashboardHelp = React.createClass

  propTypes:
    courseId: React.PropTypes.string
    inPeriod: React.PropTypes.bool

  render: ->
    courseId = @props.courseId or Router.currentParams().courseId
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
            <h3 className="improvements">
              In January 2017, you’ll see the following improvements to Concept Coach:
            </h3>

            <ol>
              <li>
                <b>Improved course setup.</b>
                There will be an easy way to teach this course again.
                You no longer need to add or archive sections to teach this course.
              </li>
              <li>
                <b>
                  The ability to copy your Question Library and use it in a future course.
                </b>
                If you excluded any questions, you’ll be able to carry over those exclusions
                to the next course you teach
              </li>
              <li>
                <b>
                  Errata fixes.  We’ve processed corrections for items found to be incorrect.
                </b>
              </li>
            </ol>
            <b>
              Please return here on January 1<sup>st</sup> to set up your new Concept Coach course!
            </b>
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
