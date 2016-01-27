React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
tasks = require './collection'
navigation = require '../navigation/model'

{ChapterSectionMixin} = require 'openstax-react-components'
{BookLink} = require '../buttons'

componentModel = require '../concept-coach/model'

TaskTitle = React.createClass
  displayName: 'TaskTitle'
  mixins: [ChapterSectionMixin]

  contextTypes:
    close: React.PropTypes.func

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
      title = <span {...sectionProps}>
        {moduleInfo.title}
      </span>
    else
      noTitle = <span>Back to Book</span>
      linkProps =
        onClick: close

    titleClasses = classnames 'concept-coach-title',
      'has-title': moduleInfo.title?
      'back-to-book': noTitle?

    <p className={titleClasses}>
      <BookLink {...linkProps}>
        {title}
        {noTitle}
      </BookLink>
    </p>

module.exports = {TaskTitle}
