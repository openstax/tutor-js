React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
tasks = require './collection'

{ChapterSectionMixin} = require 'openstax-react-components'

TaskTitle = React.createClass
  displayName: 'TaskTitle'
  mixins: [ChapterSectionMixin]
  render: ->
    {taskId, cnxUrl, close} = @props
    moduleInfo = tasks.getModuleInfo(taskId, cnxUrl)
    section = @sectionFormat(moduleInfo.chapter_section)

    sectionProps =
      className: 'chapter-section-prefix'
    sectionProps['data-section'] = section if section?

    if moduleInfo.title
      linkProps =
        href: moduleInfo.link
        target: '_blank'
      title = <span {...sectionProps}>
        {moduleInfo.title}
      </span>
    else
      noTitle = <span className='back-to-book'>Back to Book</span>
      linkProps =
        onClick: close

    titleClasses = classnames 'concept-coach-title',
      'has-title': moduleInfo.title?

    <h3 className={titleClasses}>
      {title}
      <a {...linkProps}>
        {noTitle}
        <i className='fa fa-book'></i>
      </a>
    </h3>

module.exports = {TaskTitle}
