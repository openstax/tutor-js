React = require 'react'
BS = require 'react-bootstrap'

partial = require 'lodash/partial'
classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

COURSES =
  college_physics:      'College Physics'
  college_biology:      'College Biology'
  principles_economics: 'Principles of Economics'
  macro_economics:      'Macroeconomics'
  micro_economics:      'Microeconomics'
  intro_sociology:      'Introduction to Sociology'
  anatomy_physiology:   'Anatomy & Physiology'

KEY = "course_code"

SelectCourse = React.createClass
  statics:
    title: "Choose your Tutor course"

  onSelect: (type) ->
    NewCourseActions.set({"#{KEY}": type})

  render: ->
    <BS.Table className="offerings" striped bordered>
      <tbody>
        {for code, name of COURSES
          <tr data-appearance={code} key={code}
            className={classnames({selected: NewCourseStore.get(KEY) is code})}
            onClick={partial(@onSelect, code)}
          >
            <td></td>
            <td>{name}</td>
          </tr>}
      </tbody>
    </BS.Table>


module.exports = SelectCourse
