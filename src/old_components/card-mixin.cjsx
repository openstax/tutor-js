React = require 'react'

module.exports =

  # renderContent: ->
  # hasDefaultAction: -> Optional
  # defaultAction: -> Optional
  # renderHeader: -> Optional
  # renderActions: -> Optional

  render: ->
    classes = ['card']
    classes.push(@props.className) if @props.className
    classes = classes.join(' ')

    contentClasses = ['card-content']
    contentClasses.push('has-default-action') if @hasDefaultAction?() # For CSS to change the cursor
    contentClasses = contentClasses.join(' ')

    actions = @renderActions?()
    if actions
      actions =
        <div className="card-action">
          {@renderActions()}
        </div>

    # "Add Background" is a card with just actions
    content = @renderContent()
    if content
      # Only allow a default action if the user has permission
      defaultAction = @defaultAction if @hasDefaultAction?()
      content =
        <div className={contentClasses} onClick={defaultAction}>
          {content}
        </div>

    <div className={classes}>
      {@renderHeader?()}
      {content}
      {actions}
    </div>
