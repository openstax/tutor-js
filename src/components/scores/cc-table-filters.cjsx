React    = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'CCTableFilters'

  propTypes:
    displayAs: React.PropTypes.string.isRequired
    basedOn: React.PropTypes.string.isRequired
    changeDisplayAs: React.PropTypes.func.isRequired
    changeBasedOn: React.PropTypes.func.isRequired

  clickDisplay: (mode) ->
    @props.changeDisplayAs(mode)

  clickScore: (mode) ->
    @props.changeBasedOn(mode)

  activeButton: (state, option) ->
    if state is option
      style = 'primary'
    else
      style = 'default'

  renderButtons: (method, state, options) ->
    for option, i in options
      <BS.Button
      onClick={method.bind(@, option)}
      bsStyle={@activeButton(state, option)}
      bsSize="small"
      key={i}>{option}</BS.Button>


  render: ->
    {displayAs, basedOn} = @props
    <div className='filter-row'>
      <div className='filter-item'>
        <div className='filter-label'>Display as</div>
        <BS.ButtonGroup className='filter-group'>
          {@renderButtons(@clickDisplay, displayAs, ['percentage', 'number'])}
        </BS.ButtonGroup>
      </div>
      <div className='filter-item'>
        <div className='filter-label'>Score based on</div>
        <BS.ButtonGroup className='filter-group'>
          {@renderButtons(@clickScore, basedOn, ['possible', 'attempted'])}
        </BS.ButtonGroup>
      </div>
    </div>
