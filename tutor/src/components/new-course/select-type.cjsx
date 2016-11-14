React = require 'react'
BS = require 'react-bootstrap'
partial = require 'lodash/partial'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

KEY = 'course_type'

classnames = require 'classnames'

SelectType = React.createClass

  statics:
    title: "Choose what you’d like in your course"
    shouldSkip: ->
      NewCourseStore.get('cloned_from_id') and NewCourseStore.get(KEY)

  onSelectType: (type) ->
    NewCourseActions.set({"#{KEY}": type})

  Choice: (props) ->
    <div
      onClick={partial(@onSelectType, props.type)}
      className={classnames('type', props.type, active: NewCourseStore.get(KEY) is props.type)}
    >
      <i />
      <span>{props.title}</span>
    </div>

  render: ->
    <div className="select-type">
      <@Choice type='cc' title='Concept Coach' />
      <@Choice type='tutor' title='Tutor' />
    </div>


module.exports = SelectType
