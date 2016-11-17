React = require 'react'
classnames = require 'classnames'
BS = require 'react-bootstrap'
_ = require 'lodash'
{ReactHelpers} = require 'shared'

CourseChoiceContent = React.createClass
  displayName: 'CourseChoiceContent'
  propTypes:
    className:  React.PropTypes.string
    children:   React.PropTypes.node
  render: ->
    {children, className} = @props
    passableProps = _.omit(@props, 'children', 'className')

    baseName = ReactHelpers.getBaseName(@)

    <div
      className={classnames("#{baseName}-wrapper", className)}
      {...ReactHelpers.filterProps(passableProps)}
    >
      {<div className={baseName}>
        {children}
      </div> if children?}
    </div>

CourseChoice = React.createClass
  displayName: 'CourseChoice'
  propTypes:
    className:  React.PropTypes.string
    children:   (props, propName, componentName) ->
      if props[propName].type.displayName isnt 'CourseChoiceContent'
        new Error(
          "Invalid prop #{propName} supplied to #{componentName}.
          #{propName} must be a CourseChoiceContent element."
        )
  render: ->
    {children, className} = @props
    passableProps = _.omit(@props, 'children', 'className')

    baseName = ReactHelpers.getBaseName(@)

    <div
      className={classnames(baseName, className)}
      {...ReactHelpers.filterProps(passableProps)}
    >
      {children}
    </div>

CourseChoiceItem = React.createClass
  displayName: 'CourseChoiceItem'
  propTypes:
    onClick:    React.PropTypes.func.isRequired
    className:  React.PropTypes.string
    children:   React.PropTypes.node
  render: ->
    {children, className, onClick} = @props
    itemStateProps = _.pick(@props, 'active', 'disabled')
    passableProps = _.omit(@props, 'children', 'className')

    <BS.ListGroupItem
      className={className}
      onClick={onClick}
      {...itemStateProps}
      {...ReactHelpers.filterProps(passableProps)}
    >
      <CourseChoice>
        <CourseChoiceContent>{children}</CourseChoiceContent>
      </CourseChoice>
    </BS.ListGroupItem>

module.exports = {CourseChoiceContent, CourseChoice, CourseChoiceItem}
