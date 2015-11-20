React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
tasks = require './collection'

{ChapterSectionMixin} = require 'openstax-react-components'

TaskTitle = React.createClass
  displayName: 'TaskTitle'
  mixins: [ChapterSectionMixin]
  render: ->
    {taskId, cnxUrl} = @props
    moduleInfo = tasks.getModuleInfo(taskId, cnxUrl)
    section = @sectionFormat(moduleInfo.chapter_section)

    sectionProps =
      className: 'chapter-section-prefix'
    sectionProps['data-section'] = section if section?

    <h3 className='concept-coach-title'>
      <span {...sectionProps}>
        {moduleInfo.title}
      </span>
      <a href={moduleInfo.link} target='_blank'>
        <i className='fa fa-book'></i>
      </a>
    </h3>

module.exports = {TaskTitle}
