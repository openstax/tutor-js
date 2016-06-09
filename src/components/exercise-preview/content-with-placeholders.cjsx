_ = require 'underscore'
React = require 'react'

Exercise = require '../../model/exercise'
ArbitraryHtmlAndMath = require '../html'

ContentWithPlaceholders = React.createClass

  propTypes:
    content: React.PropTypes.string.isRequired
    className: React.PropTypes.string.isRequired


  renderContentParts: ->
    _.map Exercise.replacePlaceholders(@props.content), (Part, index) ->
      if _.isString(Part)
        <ArbitraryHtmlAndMath key={index} block={true} html={Part} />
      else
        <Part key={index} />

  render: ->
    <div className={@props.className}>
      {@renderContentParts()}
    </div>


module.exports = ContentWithPlaceholders
