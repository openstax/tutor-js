React = require 'react'
ReferenceBookTOC = require './toc'

module.exports = React.createClass
  displayName: 'SlideOutMenu'
  propTypes:
    onMenuSelection: React.PropTypes.func.isRequired
    routeLinkTarget: React.PropTypes.string

  render: ->
    <div className='menu'>
      <ReferenceBookTOC {...@props} visible={@props.visible} />
    </div>
