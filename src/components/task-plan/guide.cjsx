React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseStore, CourseActions} = require '../../flux/course'
LoadableMixin = require '../loadable-mixin'

GuideShell = React.createClass
  mixins: [LoadableMixin]

  contextTypes:
    router: React.PropTypes.func

  getFlux: ->
    store: CourseStore
    actions: CourseActions

  getId: ->
    {courseId} = @context.router.getCurrentParams()
    courseId

  renderCrudeTable: (data,i) ->

    <tr>
      <td>{data.id}</td>
      <td>{data.title}</td>
      <td>{data.unit}</td>
      <td>{data.questions_answered_count}</td>
      <td>{data.current_level}</td>
      <td className="-course-guide-table-pageids">{data.page_ids}</td>
      <td>{data.practice_count}</td>
    </tr>
        

  renderLoaded: ->
    id = @getId()

    if CourseStore.isGuideLoaded(id)
      guide = CourseStore.getGuide(id)
      table = _.map(guide.fields, @renderCrudeTable)

      <BS.Panel className="-course-guide-container">
        <div className="-course-guide-table">
          <div className="-course-guide-heading">
            <h2>guide data crude table</h2>
          </div>
            <BS.Table className="-reading-progress-group">
              <thead>
                <tr>
                  <th>id</th>
                  <th>title</th>
                  <th>unit</th>
                  <th>questions_answered_count</th>
                  <th>current_level</th>
                  <th>page_ids</th>
                  <th>practice_count</th>
                </tr>
              </thead>
              <tbody>
                {table}
              </tbody>
            </BS.Table>
          </div>
      </BS.Panel>

    else
      CourseActions.loadGuide(id)
      <div className="-loading -guide">Loading Guide</div>

module.exports = {GuideShell}
