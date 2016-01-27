React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
tasks = require './collection'

{ChapterSectionMixin} = require 'openstax-react-components'
{GoToBookLink} = require '../buttons'

TaskTitle = React.createClass
  displayName: 'TaskTitle'
  mixins: [ChapterSectionMixin]

  contextTypes:
    close: React.PropTypes.func
    moduleUUID: React.PropTypes.string
    collectionUUID: React.PropTypes.string

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

    titleClasses = classnames 'concept-coach-title',
      'has-title': moduleInfo.title?

    <div className={titleClasses}>
      {title}
      <span className='concept-coach-title-link'>
        <GoToBookLink {...linkProps}/>
      </span>
    </div>

module.exports = {TaskTitle}
