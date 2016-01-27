React    = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'CCTableFilters'

  #propTypes:

  #displayAs: ->

  #basedOn: ->

  #includeSpacedPractice: ->


  render: ->
    <div className='filter-row'>
      <div className='filter-item'>
        <div className='filter-label'>Display as</div>
        <BS.ButtonGroup className='filter-group'>
          <BS.Button bsStyle='primary' bsSize="small">Percentage</BS.Button>
          <BS.Button bsSize="small">Number Correct</BS.Button>
        </BS.ButtonGroup>
      </div>
      <div className='filter-item'>
        <div className='filter-label'>Score based on</div>
        <BS.ButtonGroup className='filter-group'>
          <BS.Button bsSize="small">Total Possible</BS.Button>
          <BS.Button bsSize="small">Attempted</BS.Button>
        </BS.ButtonGroup>
      </div>
      <div className='filter-item'>
      <BS.ButtonGroup className='filter-group'>
        <div><BS.Input type="checkbox" checked readOnly /></div>
        <div className='filter-label'>Include Spaced Practice Questions</div>
      </BS.ButtonGroup>
      </div>
    </div>
