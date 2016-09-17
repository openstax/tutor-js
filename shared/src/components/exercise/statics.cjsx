BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'
{CardBody} = require '../pinned-header-footer-card/sections'


PROJECT_NAME =
  tutor: 'OpenStax Tutor'
  'concept-coach': 'OpenStax Concept Coach'

TwoStepIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->
    introText = "
      Research shows that a great way to boost your learning is to quiz
      yourself.  For maximum benefit, read the text and then answer the
      free response question in your own words.  Then, select the best
      multiple choice answer so #{PROJECT_NAME[@props.project]} can give you immediate
      feedback.  Both you and your instructor can review your answers later.
    "

    <CardBody className="task-step openstax-two-step-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>Two-step questions</span>
      </h1>
      <p>{introText}</p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>


SpacedPracticeIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->

    introText = "
      Did you know?  Research shows you can strengthen your
      memory—and spend less time studying—if
      you revisit material over multiple study sessions.
        #{PROJECT_NAME[@props.project]} will include spaced practice questions—like the
      following ones—from prior sections to give your learning a boost.  
      You may occasionally see questions you've seen before.
    "

    <CardBody className="task-step openstax-spaced-practice-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>Reading Review</span>
      </h1>
      <p>{introText}</p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>


PersonalizedIntro = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->

    introText = "
      Personalized questions—like this next one—are chosen specifically
      for you by #{PROJECT_NAME[@props.project]} based on your learning history.
    "

    <CardBody className="task-step openstax-personalized-intro #{@props.project}">
      <div className="heading">{PROJECT_NAME[@props.project]}</div>
      <h1>
        <span>Personalized questions</span>
      </h1>
      <p>{introText}</p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>

module.exports =
  'two-step-intro': TwoStepIntro
  'spaced-practice-intro': SpacedPracticeIntro
  'personalized-intro': PersonalizedIntro
