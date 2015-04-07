React = require 'react'
_ = require 'underscore'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseStore, CourseActions} = require '../../flux/course'
LoadableItem = require '../loadable-item'
PracticeButton = require '../practice-button'

Guide = React.createClass

  renderCrudeTable: (data,i) ->
    {id} = @props

    <tr>
      <td>{data.id}</td>
      <td>{data.title}</td>
      <td>{data.unit}</td>
      <td>{data.questions_answered_count}</td>
      <td>{data.current_level}</td>
      <td className="-course-guide-table-pageids">{data.page_ids}</td>
      <td>{data.practice_count}</td>
      <td><PracticeButton courseId={id} pageIds={data.page_ids}/></td>
    </tr>
        
  render: ->
    {id} = @props

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
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {table}
            </tbody>
          </BS.Table>
        </div>
    </BS.Panel>


GuideShell = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()

    <LoadableItem
      store={CourseStore}
      actions={CourseActions}
      load={CourseActions.loadGuide}
      id={courseId}
      renderItem={=> <Guide key={courseId} id={courseId} />}
    />

module.exports = {GuideShell, Guide}
