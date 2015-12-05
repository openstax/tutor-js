React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CCDashboardStore, CCDashboardActions} = require '../../flux/cc-dashboard'
LoadableItem = require '../loadable-item'
CCDashboard = require './dashboard'

BookLinks = require './book-links'

classnames = require 'classnames'


DashboardShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()

    <div>
      <BookLinks courseId={courseId} />
      <h1>
        Class Performance
        <Router.Link className='btn btn-default pull-right' to='viewScores' params={{courseId}}>
          View Detailed Scores
        </Router.Link>
      </h1>
      <LoadableItem
        store={CCDashboardStore}
        actions={CCDashboardActions}
        id={courseId}
        renderItem={-> <CCDashboard key={courseId} id={courseId} />}
      />
    </div>

module.exports = DashboardShell
