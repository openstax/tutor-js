React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

COURSES =
  college_physics:      'College Physics'
  college_biology:      'College Biology'
  principles_economics: 'Principles of Economics'
  macro_economics:      'Macroeconomics'
  micro_economics:      'Microeconomics'
  intro_sociology:      'Introduction to Sociology'
  anatomy_physiology:   'Anatomy & Physiology'

SelectCourse = React.createClass

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
    @props.onContinue(course_code: @state.selected)

  onSelect: (selected) -> @setState({selected})

  render: ->
    <BS.Panel header="Choose your Tutor course" footer={<@Footer />}>
      <BS.Table className="offerings" striped bordered >
        <tbody>
          {for appearance, name of COURSES
            <tr data-appearance={appearance} key={appearance}
              className={classnames(selected: @state.selected is appearance)}
              onClick={_.partial(@onSelect, appearance)}
            >
              <td></td>
              <td>{name}</td>
            </tr>}
        </tbody>
      </BS.Table>
    </BS.Panel>



module.exports = SelectCourse
