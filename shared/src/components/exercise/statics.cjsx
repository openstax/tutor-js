BS = require 'react-bootstrap'
React = require 'react'
_ = require 'underscore'
{CardBody} = require '../pinned-header-footer-card/sections'


HEADINGS =
  tutor: 'OPENSTAX TUTOR'
  'concept-coach': 'OPENSTAX CONCEPT COACH'

TwoStepIntro = React.createClass

  propTypes:
    project: React.PropTypes.string.isRequired

  render: ->
    <div>
      <div className="heading">{HEADINGS[@props.project]}</div>
      <p className="title">Two-step questions</p>
      <p className="body">
        Research shows that a great way to boost your learning is to quiz
        yourself.  For maximum benefit, read the text and then answer the
        free response question in your own words.  Then, select the best
        multiple choice answer so OpenStax Concept Coach can give you immediate
        feedback. Both you and your instructor can review your answers later.
      </p>
    </div>


SpacedPracticeIntro = React.createClass

  propTypes:
    project: React.PropTypes.string.isRequired

  render: ->
    <div>
      <div className="heading">{HEADINGS[@props.project]}</div>
      <h1>Reading Review</h1>
      <p>
        <b>Did you know?</b> Research shows you can strengthen your
        memory&mdash;<b>and spend less time studying</b>&mdash;if
        you revisit material over multiple study sessions.
      </p>
      <p>
        OpenStax Tutor will include <b>spaced practice</b> questions&mdash;like the
        following ones&mdash;from prior sections to give your learning a boost.
        You may occasionally see questions you&#39;ve seen before.
      </p>
    </div>


PersonalizedIntro = React.createClass

  propTypes:
    project: React.PropTypes.string.isRequired

  render: ->
    <div>
      <div className="heading">{HEADINGS[@props.project]}</div>
      <h1>Personalized questions</h1>
      <p>
        Personalized questions&mdash;like this next one&mdash;are chosen specifically
        for you by OpenStax Tutor based on your learning history.
      </p>
    </div>

module.exports =
  'two-step-intro': TwoStepIntro
  'spaced-practice-intro': SpacedPracticeIntro
  'personalized-intro': PersonalizedIntro
