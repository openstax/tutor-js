React = require 'react'
ChapterSectionMixin = require '../chapter-section-mixin'

module.exports = React.createClass
  displayName: 'ChapterSection'
  propTypes:
    section: React.PropTypes.array.isRequired
  componentWillMount: ->
    @setState(skipZeros: false)
  mixins: [ChapterSectionMixin]
  render: ->
    {section} = @props
    <span className="chapter-section" data-chapter-section={@sectionFormat(section)}>
      {@sectionFormat(section)}
    </span>
