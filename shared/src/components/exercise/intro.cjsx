BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

Markdown = require '../markdown'
{CardBody} = require '../pinned-header-footer-card/sections'
{ TITLES,
  ALIASES,
  INTRO_ALIASES,
  getIntroText
} = require '../../helpers/step-helps'

PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

ExerciseIntro =  React.createClass
  displayName: 'ExerciseIntro'
  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->
    {stepIntroType, project, onContinue} = @props

    stepType = _.invert(INTRO_ALIASES)[stepIntroType]

    groupLabel = TITLES[stepType]
    classes = classnames 'task-step', "openstax-#{ALIASES[stepType]}-intro", project

    <CardBody className={classes}>
      <div className="heading">{PROJECT_NAME[project]}</div>
      <h1>
        <span>{groupLabel}</span>
      </h1>
      {getIntroText[stepType](project)}
      <BS.Button onClick={onContinue}>Continue</BS.Button>
    </CardBody>

module.exports = ExerciseIntro
