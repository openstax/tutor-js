React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'
{PageProgress} = require './page'

ChapterProgress = React.createClass
  displayName: 'ChapterProgress'
  getDefaultProps: ->
    chapter: {}
  mixins: [ChapterSectionMixin]
  render: ->
    {chapter, className} = @props

    classes = classnames 'concept-coach-progress-chapter', className
    section = @sectionFormat(chapter.chapter_section)

    sectionProps =
      className: 'chapter-section-prefix'
    sectionProps['data-section'] = section if section?

    pages = _.map(chapter.pages, (page) ->
      <PageProgress page={page} key={"progress-page-#{page.id}"}/>
    )

    <div className={classes}>
      <h3 {...sectionProps}>
          {chapter.title}
      </h3>
      <ul className='concept-coach-progress-pages'>
        {pages}
      </ul>
    </div>

module.exports = {ChapterProgress}
