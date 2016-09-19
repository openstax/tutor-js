BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'

{CardBody} = require '../pinned-header-footer-card/sections'
{PERSONALIZED_GROUP, SPACED_PRACTICE_GROUP, makeHelpText} = require '../../helpers/step-helps'


PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

TwoStepIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->

    <CardBody className="task-step openstax-two-step-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>Two-step questions</span>
      </h1>
      <p>{makeHelpText['two-step'](@props.project)}</p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>


SpacedPracticeIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->

    <CardBody className="task-step openstax-spaced-practice-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>Reading Review</span>
      </h1>
      <p>{makeHelpText[SPACED_PRACTICE_GROUP](@props.project)}</p>
      <BS.Button bsStyle='primary' onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>


PersonalizedIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->

    <CardBody className="task-step openstax-personalized-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>Personalized questions</span>
      </h1>
      <p>{makeHelpText[PERSONALIZED_GROUP](@props.project)}</p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>

module.exports =
  'two-step-intro': TwoStepIntro
  'spaced-practice-intro': SpacedPracticeIntro
  'personalized-intro': PersonalizedIntro
