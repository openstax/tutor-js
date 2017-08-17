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

GROUP_BY_INTRO_ALIAS = _.invert(INTRO_ALIASES)

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

    stepGroup = GROUP_BY_INTRO_ALIAS[stepIntroType]

    classes = classnames 'task-step', "openstax-#{ALIASES[stepGroup]}-intro", project

    <CardBody className={classes}>
      <h1>
        <span>{TITLES[stepGroup]}</span>
      </h1>
      {getIntroText[stepGroup](project)}
      <a className="btn continue" onClick={onContinue}>Continue</a>
    </CardBody>

module.exports = ExerciseIntro
