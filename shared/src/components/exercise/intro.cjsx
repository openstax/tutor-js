BS = require 'react-bootstrap'
React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'underscore'
classnames = require 'classnames'

Markdown = require '../markdown'
{CardBody} = require '../pinned-header-footer-card/sections'
{ TITLES,
  ALIASES,
  INTRO_ALIASES,
  getIntroText
} = require '../../helpers/step-helps'

GROUP_BY_INTRO_ALIAS = _.invert(INTRO_ALIASES)

PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

ExerciseIntro =  React.createClass
  displayName: 'ExerciseIntro'
  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired
    stepIntroType: React.PropTypes.string.isRequired

  componentWillReceiveProps: (nextProps) ->
    # focus the cardbody when paging through
    # Otherwise the continue button may still be focused, causing screenreaders to fail
    if nextProps.stepIntroType isnt this.props.stepIntroType
      ReactDOM.findDOMNode(@refs.body).focus()

  componentDidMount: ->
    ReactDOM.findDOMNode(@refs.body).focus()

  render: ->
    {stepIntroType, project, onContinue} = @props

    stepGroup = GROUP_BY_INTRO_ALIAS[stepIntroType]

    classes = classnames 'task-step', "openstax-#{ALIASES[stepGroup]}-intro", project

    <CardBody ref={'body'} className={classes}>
      <h1>
        <span>{TITLES[stepGroup]}</span>
      </h1>
      {getIntroText[stepGroup](project)}
      <button className="btn continue" onClick={onContinue}>Continue</button>
    </CardBody>

module.exports = ExerciseIntro
