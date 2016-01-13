React = require 'react'
classnames = require 'classnames'
_ = require 'underscore'

SectionProgress = React.createClass
  displayName: 'SectionProgress'
  getDefaultProps: ->
    progress: null
    title: 'Progress'
  render: ->
    {progress, title, children, className} = @props
    progress ?= children
    return null if _.isEmpty(progress)

    classes = classnames 'concept-coach-progress-section', className

    <div className={classes}>
      <h1>{title}</h1>
      {progress}
    </div>

module.exports = {SectionProgress}
