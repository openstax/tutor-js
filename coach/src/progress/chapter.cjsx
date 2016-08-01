React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'
{PageProgress} = require './page'

ChapterProgress = React.createClass
  displayName: 'ChapterProgress'
  propTypes:
    maxLength: React.PropTypes.number
    className: React.PropTypes.string
    chapter: React.PropTypes.shape(
      chapter_section: React.PropTypes.array
      pages: React.PropTypes.arrayOf(React.PropTypes.object)
    )

  getDefaultProps: ->
    chapter: {}
  mixins: [ChapterSectionMixin]
  render: ->
    {chapter, className, maxLength} = @props
    return null unless chapter.pages?.length > 0

    classes = classnames 'concept-coach-progress-chapter', className
    section = @sectionFormat(chapter.chapter_section)

    sectionProps =
      className: 'chapter-section-prefix'
    sectionProps['data-section'] = section if section?

    pages = _.map chapter.pages, (page) ->
      <PageProgress
        page={page}
        maxLength={maxLength}
        key={"progress-page-#{page.id}"}/>

    title = <h3 {...sectionProps}>
        {chapter.title}
    </h3> if chapter.title?

    <div className={classes}>
      {title}
      <ul className='concept-coach-progress-pages'>
        {pages}
      </ul>
    </div>

module.exports = {ChapterProgress}
