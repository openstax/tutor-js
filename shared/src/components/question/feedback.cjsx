React = require 'react'
classnames = require 'classnames'
_ = require 'underscore'

ArbitraryHtmlAndMath = require '../html'

SimpleFeedback = React.createClass
  displayName: 'SimpleFeedback'
  propTypes:
    children: React.PropTypes.string.isRequired
  contextTypes:
    processHtmlAndMath: React.PropTypes.func
  render: ->
    htmlAndMathProps = _.pick(@context, 'processHtmlAndMath')
    <ArbitraryHtmlAndMath
      {...htmlAndMathProps}
      className={classnames 'question-feedback-content', 'has-html', @props.className}
      html={@props.children}
      block={true}/>

Feedback = React.createClass
  displayName: 'Feedback'
  propTypes:
    children: React.PropTypes.string.isRequired
    position: React.PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
  getDefaultProps: ->
    position: 'bottom'
  contextTypes:
    processHtmlAndMath: React.PropTypes.func
  render: ->
    wrapperClasses = classnames 'question-feedback', @props.position
    htmlAndMathProps = _.pick(@context, 'processHtmlAndMath')

    <div
      className={wrapperClasses}
    >
      <div className='arrow' aria-label="Answer Feedback"/>
      <SimpleFeedback {...htmlAndMathProps}>{@props.children}</SimpleFeedback>
    </div>

module.exports = {Feedback, SimpleFeedback}
