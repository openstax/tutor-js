React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseStore, CourseActions} = require '../../flux/course'
LoadableMixin = require '../loadable-mixin'

Guide = React.createClass
  mixins: [LoadableMixin]

  contextTypes:
    router: React.PropTypes.func

  getFlux: ->
    store: CourseStore
    actions: CourseActions

  getId: ->
    {courseId} = @context.router.getCurrentParams()
    courseId

  renderCrudeTable: (data) ->
    <div className="course-guide-table">
      <div className="course-guide-heading">
        guide table
      </div>
      <BS.Table className="reading-progress-group">
        <thead>test</thead>
      </BS.Table>
    </div>

  renderLoaded: ->
    id = @getId()

    if CourseStore.isGuideLoaded(id)
      guide = CourseStore.getGuide(id)
      table = _.map(guide.fields, @renderCrudeTable)

      <BS.Panel className="course-guide-container">
        here it is: {table}
      </BS.Panel>

    else
      CourseActions.loadGuide(id)
      <div className="-loading -guide">Loading Guide</div>

module.exports = Guide
