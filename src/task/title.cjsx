React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
tasks = require './collection'

{ChapterSectionMixin} = require 'openstax-react-components'
{BookLink} = require '../buttons'

TaskTitle = React.createClass
  displayName: 'TaskTitle'
  mixins: [ChapterSectionMixin]

  contextTypes:
    close: React.PropTypes.func
    moduleUUID: React.PropTypes.string
    collectionUUID: React.PropTypes.string
    triggeredFrom:  React.PropTypes.shape(
      moduleUUID:     React.PropTypes.string
      collectionUUID: React.PropTypes.string
    )

  isFromOpen: ->
    {triggeredFrom} = @context
    viewingInfo = _.pick(@props, 'moduleUUID', 'collectionUUID')

    _.isEqual(triggeredFrom, viewingInfo)

  render: ->
    {taskId, cnxUrl} = @props
    {close} = @context
    moduleInfo = tasks.getModuleInfo(taskId, cnxUrl)
    return null unless moduleInfo

    section = @sectionFormat(moduleInfo.chapter_section)

    sectionProps =
      className: 'chapter-section-prefix'
    sectionProps['data-section'] = section if section?

    linkProps = _.pick(@props, 'collectionUUID', 'moduleUUID')
    linkProps.role = 'button'
    linkProps.link = moduleInfo.link

    if moduleInfo.title
      linkProps.target = '_blank'
      title = <h3 {...sectionProps}>
        {moduleInfo.title}
      </h3>

    linkAction = if @isFromOpen() then 'Return' else 'Go'

    titleClasses = classnames 'concept-coach-title',
      'has-title': moduleInfo.title?

    <div className={titleClasses}>
      {title}
      <BookLink {...linkProps}>
        {linkAction} to Reading
      </BookLink>
    </div>

module.exports = {TaskTitle}
