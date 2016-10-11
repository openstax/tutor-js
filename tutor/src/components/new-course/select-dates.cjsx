React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

QUARTERS =
  '2017Q4': 'Fall 2017'
  '2018Q1': 'Winter 2018'
  '2018Q2': 'Spring 2018'
  '2018Q3': 'Summer 2018'

SelectDates = React.createClass

  getInitialState: ->
    selected: null

  propTypes:
    onContinue: React.PropTypes.func.isRequired
    onCancel: React.PropTypes.func.isRequired

  Footer: ->
    <div className="controls">
      <BS.Button onClick={@props.onCancel}>Cancel</BS.Button>
      <BS.Button onClick={@onContinue} disabled={not @state.selected}
        bsStyle="primary">Continue</BS.Button>
    </div>

  onContinue: ->
    @props.onContinue(quarter: @state.selected)

  onSelect: (selected) -> @setState({selected})

  render: ->
    <BS.Panel header="Choose when to teach the course" footer={<@Footer />}>
      <BS.Table className="quarters" striped bordered >
        <tbody>
          {for code, name of QUARTERS
            <tr key={code}
              className={classnames(selected: @state.selected is code)}
              onClick={_.partial(@onSelect, code)}
            >
              <td>{name}</td>
            </tr>}
        </tbody>
      </BS.Table>
    </BS.Panel>



module.exports = SelectDates
