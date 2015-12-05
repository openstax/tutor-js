React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
tasks = require './collection'

{ChapterSectionMixin} = require 'openstax-react-components'

TaskTitle = React.createClass
  displayName: 'TaskTitle'
  mixins: [ChapterSectionMixin]
  broadcastNav: ->
    {collectionUUID, moduleUUID} = @props
    tasks.channel.emit('close.for.book', {collectionUUID, moduleUUID})
  render: ->
    {taskId, cnxUrl, close} = @props
    moduleInfo = tasks.getModuleInfo(taskId, cnxUrl)
    section = @sectionFormat(moduleInfo.chapter_section)

    sectionProps =
      className: 'chapter-section-prefix'
    sectionProps['data-section'] = section if section?

    if moduleInfo.title
      linkProps =
        target: '_blank'
        onClick: @broadcastNav
      title = <span {...sectionProps}>
        Go to {moduleInfo.title}
      </span>
    else
      noTitle = <span className='back-to-book'>Back to Book</span>
      linkProps =
        onClick: close

    titleClasses = classnames 'concept-coach-title',
      'has-title': moduleInfo.title?

    <p className={titleClasses}>
      <a {...linkProps}>
        <i className='fa fa-book'></i>
        {title}
        {noTitle}
      </a>
    </p>

module.exports = {TaskTitle}
