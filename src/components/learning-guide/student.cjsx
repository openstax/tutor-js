React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

LearningGuide = require '../../flux/learning-guide'

Guide = require './guide'

module.exports = React.createClass
  displayName: 'LearningGuideStudentDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired

  onPractice: (section) ->
    @context.router.transitionTo('viewPractice', {courseId: @props.courseId}, {page_ids: section.page_ids})

  returnToDashboard: ->
    @context.router.transitionTo('viewStudentDashboard', {courseId: @props.courseId})

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide main student'>
      <Guide
        onPractice={@onPractice}
        courseId={courseId}
        onReturn={@returnToDashboard}
        allSections={LearningGuide.Student.store.getAllSections(courseId)}
        chapters={LearningGuide.Student.store.get(courseId).children}
      />
    </BS.Panel>
