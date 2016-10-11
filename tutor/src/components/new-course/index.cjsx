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


NewCourse = React.createClass

  Footer: ->
    <div className="controls">
      <BS.Button>Cancel</BS.Button>
      <BS.Button bsStyle="primary">Continue</BS.Button>
    </div>

  render: ->
    <div className="new-course">
      <BS.Panel header="Choose your Tutor course" footer={<@Footer />}>
        <BS.Table className="offerings" striped bordered >
          <tbody>
            {for appearance, name of COURSES
              <tr data-appearance={appearance} key={appearance}>
                <td></td>
                <td>{name}</td>
              </tr>}
          </tbody>
        </BS.Table>
      </BS.Panel>
    </div>



module.exports = NewCourse
