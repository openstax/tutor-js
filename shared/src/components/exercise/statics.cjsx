BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'

{CardBody} = require '../pinned-header-footer-card/sections'
{
  PERSONALIZED_GROUP,
  SPACED_PRACTICE_GROUP,
  TWO_STEP_ALIAS,
  LABELS,
  getHelpText
} = require '../../helpers/step-helps'


PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

TwoStepIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->
    groupLabel = LABELS[TWO_STEP_ALIAS]

    <CardBody className="task-step openstax-two-step-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>{groupLabel} questions</span>
      </h1>
      <p>{getHelpText['two-step'](@props.project)}</p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>


SpacedPracticeIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->
    groupLabel = LABELS[SPACED_PRACTICE_GROUP]

    <CardBody className="task-step openstax-spaced-practice-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>{groupLabel}</span>
      </h1>
      <p>{getHelpText[SPACED_PRACTICE_GROUP](@props.project)}</p>
      <BS.Button bsStyle='primary' onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>


PersonalizedIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->
    groupLabel = LABELS[PERSONALIZED_GROUP]

    <CardBody className="task-step openstax-personalized-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>{groupLabel} questions</span>
      </h1>
      <p>{getHelpText[PERSONALIZED_GROUP](@props.project)}</p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>

module.exports =
  'two-step-intro': TwoStepIntro
  'spaced-practice-intro': SpacedPracticeIntro
  'personalized-intro': PersonalizedIntro
