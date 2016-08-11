BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'
{CardBody} = require '../pinned-header-footer-card/sections'
UiSettings = require '../../model/ui-settings'

SETTINGS_KEY = 'has-viewed-two-step-help'

HEADINGS =
  tutor: 'OPENSTAX TUTOR'
  'concept-coach': 'OPENSTAX CONCEPT COACH'

TwoStepHelp = React.createClass

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    project: React.PropTypes.string.isRequired

  render: ->
    <CardBody className="task-step openstax-two-step-help #{@props.project}">
      <div className="heading">{HEADINGS[@props.project]}</div>
      <p className="title">Two-step questions</p>
      <p className="body">
        Research shows that a great way to boost your learning is to quiz
        yourself.  For maximum benefit, read the text and then answer the
        free response question in your own words.  Then, select the best
        multiple choice answer so OpenStax Concept Coach can give you immediate
        feedback. Both you and your instructor can review your answers later.
      </p>
      <BS.Button onClick={@props.onContinue}>Continue</BS.Button>
    </CardBody>


# Object is mixed into the exercise
module.exports = {

  hasTwoStepHelp: ->
    firstpart = _.first @props.parts
    return (
      firstpart?.type is 'exercise' and
        _.include(_.first(firstpart?.content.questions).formats, 'free-response') and
        not UiSettings.get(SETTINGS_KEY)
    )

  renderTwoStepHelp: ->
    <TwoStepHelp project={@props.project} onContinue={@onTwoStepHelpContinue} />

  onTwoStepHelpContinue: ->
    UiSettings.set(SETTINGS_KEY, true)
    @forceUpdate()

}
