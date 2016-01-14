React = require 'react'
classnames = require 'classnames'

ArbitraryHtmlAndMath = require '../html'

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

    <div className={wrapperClasses}>
      <div className='arrow'/>
      <ArbitraryHtmlAndMath
        {...htmlAndMathProps}
        className='question-feedback-content has-html'
        html={@props.children}
        block={true}/>
    </div>

module.exports = {Feedback}