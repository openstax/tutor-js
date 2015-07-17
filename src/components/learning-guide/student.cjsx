React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{LearningGuideStudentStore} = require '../../flux/learning-guide-student'

Guide = require './guide'

module.exports = React.createClass
  displayName: 'LearningGuideStudentDisplay'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId:  React.PropTypes.string.isRequired

  render: ->
    {courseId} = @props
    <BS.Panel className='learning-guide main student'>
      <Guide
        courseId={courseId}
        allSections={LearningGuideStudentStore.getSortedSections(courseId)}
        chapters={LearningGuideStudentStore.get(courseId).children}
      />
    </BS.Panel>
