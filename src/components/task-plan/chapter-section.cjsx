React = require 'react'
ChapterSectionMixin = require '../chapter-section-mixin'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'ChapterSection'
  propTypes:
    section: React.PropTypes.oneOfType([
      React.PropTypes.array
      React.PropTypes.string
    ]).isRequired

  componentWillMount: ->
    @setState(skipZeros: false)
  mixins: [ChapterSectionMixin]
  render: ->
    {section} = @props
    <span className="chapter-section">
      {@sectionFormat(section)}
    </span>
