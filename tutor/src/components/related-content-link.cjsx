React    = require 'react'
_ = require 'underscore'

{ChapterSectionMixin} = require 'shared'
Icon = require './icon'
BrowseTheBook = require './buttons/browse-the-book'


RelatedContentLink = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    content: React.PropTypes.arrayOf(
      React.PropTypes.shape(
        title: React.PropTypes.string.isRequired
        chapter_section: React.PropTypes.array.isRequired
      ).isRequired
    ).isRequired

  mixins: [ChapterSectionMixin]

  render: ->
    return null if _.isEmpty(@props.content)

    <div className='related-content-link'>
      <span className="preamble">Comes from </span>
      {for content in @props.content
        section = @sectionFormat(content.chapter_section)
        <BrowseTheBook key={section} unstyled section={section}
          courseId={@props.courseId} onlyShowBrowsable={false} tabIndex={-1}
        >
          <span className="part">
            <span className="section">{section} </span>
            <span className="title">{content.title}</span>
          </span>
        </BrowseTheBook>}
    </div>

module.exports = RelatedContentLink
