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
      <td className="-course-guide-table-id">{data.id}</td>
      <td className="-course-guide-table-title">{data.title}</td>
      <td className="-course-guide-table-unit">{data.unit}</td>
      <td className="-course-guide-table-questions_answered_count">{data.questions_answered_count}</td>
      <td className="-course-guide-table-current_level">{data.current_level}</td>
      <td className="course-guide-table-page_ids">{data.page_ids}</td>
      <td className="-course-guide-table-practice_count">{data.practice_count}</td>
      <td className="-course-guide-table-practice_button"><PracticeButton courseId={id} page_ids={data.page_ids}>Practice</PracticeButton></td>
    </tr>

  render: ->
    {id} = @props

    guide = CourseStore.getGuide(id)
    table = _.map(guide.fields, @renderCrudeTable)

    <BS.Panel className="-course-guide-container">
      <div className="-course-guide-group">
        <div className="-course-guide-heading">
          <h2>guide data crude table</h2>
        </div>
          <BS.Table className="-course-guide-table">
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
      isLoaded={CourseStore.isGuideLoaded}
      isLoading={CourseStore.isGuideLoading}
      id={courseId}
      renderItem={=> <Guide key={courseId} id={courseId} />}
    />

module.exports = {GuideShell, Guide}
