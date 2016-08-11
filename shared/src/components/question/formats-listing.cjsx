React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{AnswersTable} = require './answers-table'
ArbitraryHtmlAndMath = require '../html'
FormatsListing = require './formats-listing'

FormatsListing = React.createClass
  propTypes:
    formats: React.PropTypes.arrayOf(React.PropTypes.string).isRequired

  getDefaultProps: ->
    formats: []

  render: ->
    <div className="formats-listing">
      <div className='header'>Formats:</div>
      {for format, i in @props.formats
        <span key={i}>{format}</span>}
    </div>


module.exports = FormatsListing
